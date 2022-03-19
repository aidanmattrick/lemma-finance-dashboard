import json
import pandas as pd
import janitor
import os
import numpy as np
import pandas_flavor as pf
from pathlib import Path
import warnings
import re
import ast
#Check this isn't hacky
import sys
sys.path.append("../")
import config
import requests

#Notes:
# - Run from root dir
# - Need to handle case in which no deposit, withdraw, or rebalance events for certain timeframe
# - Handle with current eth price
# - Update requirements.txt... or create conda env for GCF
# - Note TVL graph with Covalent API shows TVL never reached $1M, just short
# -    - This is due to Covalent API Using daily avg ether price not prev. minutely per Dune
#      - Import Dune when saving to DB?
# TEST REBALANCE GRAPH STILL

PROJECT_DIR = '/tmp'
DEPOSITOR_COLS_TO_FLOAT = ['amount', 'collateralRequired']
WITHDRAWOR_COLS_TO_FLOAT = ['amount', 'collateralGotBack']

#Helper Fx's
@pf.register_dataframe_method
def process_dictionary_column(df, column_name):
    if column_name in df.columns:
        return (df
                .join(df[column_name].apply(pd.Series))
                .drop(column_name, 1))
    else:
        return df

def process_payload(row):
    text = str(row.split('&'))
    text = re.sub(r"(:)", r"\1'", text) #insert ' after :
    text = re.sub(r"(:)", r"'\1", text) #insert ' before :
    text = re.sub("\[", r"{", text)
    text = re.sub("\]", r"}", text)
    return ast.literal_eval(text) # turn into dict to make pipeline more robust to changing fx's/params

def load_df():
    #All events from USDLemma contract
    df = (pd
            #FOR WHEN GCLOUD
            #.read_parquet(f'{PROJECT_DIR}/raw/USDLemma.parquet')
            .read_parquet(f'data/raw/USDLemma_03-19-22.parquet')
            .assign(
                    values = lambda df: df.return_values.str.replace('=',':')
            )
            .transform_column('values', process_payload)
            .drop(columns=['return_values'])
            .transform_columns(['block_number'], lambda x: x.astype(int), elementwise=False)
            )
    return df

def process_event_dfs(df):
#Get deposit, withdraw, and rebalance DF's

#Structuring transactions in relation to Lemma balance sheet
#I.e. while withdrawal represents credit to wallet, it represents debit for Lemma
    deposit_df = (df
                .query("event == 'DepositTo'")
                .process_dictionary_column("values")
                .transform_columns(DEPOSITOR_COLS_TO_FLOAT, lambda x: x.astype(float), elementwise=False)
                .assign(
                    USD_amount = lambda df: df['amount'] / (10**18),
                    eth_amount = lambda df: df['collateralRequired'] / (10**18), # *-1?
                    transaction_eth = lambda df: df['eth_amount'],
                    transaction_USD = lambda df: df['USD_amount'],
                    wallet = lambda df: df['to']
                )
                .drop(columns=['0', '1', '2', '3', '4', 'dexIndex', 'to', 'collateralRequired'])
                .drop_duplicates('tx_hash')
                )

    withdraw_df = (df
                .query("event == 'WithdrawTo'")
                .process_dictionary_column("values")
                .transform_columns(WITHDRAWOR_COLS_TO_FLOAT, lambda x: x.astype(float), elementwise=False)
                .assign(
                    USD_amount = lambda df: df['amount'] / (10**18),
                    eth_amount = lambda df: df['collateralGotBack'] / (10**18),
                    transaction_USD = lambda df: df['USD_amount'] * -1, #Always negative as withdrawing
                    transaction_eth = lambda df: df['eth_amount'] * -1, #Always negative as withdrawing
                    wallet = lambda df: df['to']
                )
                .drop(columns=['0', '1', '2', '3', '4', 'dexIndex', 'to', 'collateralGotBack'])
                .drop_duplicates('tx_hash')
                )

    rebalance_df = (df
                .query("event == 'Rebalance'")
                .process_dictionary_column("values")
                .transform_column('amount', lambda x: x.astype(float), elementwise=False)
                .transform_column('dexIndex', lambda x: x.astype(int), elementwise=False)
                .assign(
                  amount_USD = lambda df: df['amount'] / (10**18), #based on max value of 979.9 of amount on Dec 9, 2021 seems to be USD not eth but confirm
                )
                .drop(columns=['0', '1', '2'])
               )

    print('Deposit DF shape: ', deposit_df.shape)
    print('Withdrawal DF shape: ', withdraw_df.shape)
    print('Rebalance DF shape: ', rebalance_df.shape)

    return deposit_df, withdraw_df, rebalance_df



#Will need to find a way to get timestamps based on block numbers...
def get_block_timestamps(df):
    block_list = list(df['block_number'])
    timestamps = []

    for block in block_list:
        url = f'https://api.covalenthq.com/v1/42161/block_v2/{block}/?key={config.covalent_api_key}'
        headers = {"Content-Type": "application/json"}
        response = requests.request("GET", url, headers=headers)
        json_blob = json.loads(response.text)
        timestamps.append(json_blob['data']['items'][0]['signed_at'])

    requests_df = (pd
                   .DataFrame({'block_number': block_list, 'timestamp':timestamps})
                   .assign(
                    timestamp_day = lambda df: df.timestamp.str.slice(0,10)
                   )
                   .transform_column('timestamp', pd.to_datetime, elementwise=False)
                  )
    return requests_df

#Will need a way to use timestamps to get eth price
#So wait until that has been done above...
def get_curr_eth_price():
    url = f'https://api.covalenthq.com/v1/pricing/tickers/?quote-currency=USD&format=JSON&tickers=weth&key={config.covalent_api_key}'
    headers = {"Content-Type": "application/json"}
    response = requests.request("GET", url, headers=headers)
    json_blob = json.loads(response.text)
    return json_blob['data']['items'][0]['quote_rate']

def get_hist_eth_price(requests_df):
    date_list = list(requests_df['timestamp_day'])
    prices = []
    for date in date_list:
        url = f'https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/1/USD/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/?quote-currency=USD&format=JSON&from={date}&to={date}&key={config.covalent_api_key}'
        headers = {"Content-Type": "application/json"}
        response = requests.request("GET", url, headers=headers)
        json_blob = json.loads(response.text)
        prices.append(json_blob['data'][0]['prices'][0]['price'])

    requests_df = (requests_df
                .add_column('price', prices)
                .drop(columns=['timestamp_day'])
                )

    return requests_df


def get_USDL_balance_df(deposit_df, withdraw_df):
    #returns USDL DF for graphing

    #get DF with cumulative balance in USDL and TVL (in ETH)
    balance_df = (pd
              .concat([deposit_df, withdraw_df], axis=0)
              .sort_values('block_number')
              .assign(
              USDL_minted = lambda df: df['transaction_USD'].cumsum(),
              tvl = lambda df: df['transaction_eth'].cumsum() # In ETH
              )
             )
    balance_df.set_index('timestamp', inplace=True)

    #get DF with num of mint_events & redeem events per day
    balance_df_daily_evts = (balance_df
                        .assign(
                            tvl_USD = lambda df: df['tvl'] * df['price'],
                            mint_events = np.where(balance_df.event == 'DepositTo', 1, None),
                            redeem_events = np.where(balance_df.event == 'WithdrawTo', 1, None)
                        )
                        # .assign(
                        #     mint_events = np.where(balance_df.event == 'DepositTo', 1, None),
                        #     redeem_events = np.where(balance_df.event == 'WithdrawTo', 1, None)
                        # )
                        .resample('1D').agg({'mint_events': 'count', 'redeem_events': 'count'})
                     )
    #get daily DF - groups events/balances, resamples to 1D, and forward fills
    balance_df_daily = (balance_df
                    .assign(
                        tvl_USD = lambda df: df['tvl'] * df['price']
                    )
                    #.set_index('timestamp')
                    .resample('1D').mean().ffill()
                    .merge(balance_df_daily_evts, left_index=True, right_index=True)
                    )
    return balance_df_daily

def get_rebalance_df(raw_rebalance_df):
    rebalance_df_daily_events = (raw_rebalance_df
                            .assign(
                            mint_events = np.where(raw_rebalance_df.amount_USD > 0, 1, None),
                            redeem_events = np.where(raw_rebalance_df.amount_USD < 0, 1, None)
                            )
                            .sort_values('block_number')
                            .set_index('timestamp')
                            .resample('1D').agg({'mint_events': 'count', 'redeem_events': 'count'})
                            )
    rebalance_mint_amt = (raw_rebalance_df
            .query("amount_USD > 0")
            .set_index('timestamp')
            .rename_column('amount_USD', 'amount_USD_mint')
            .resample('1D').agg({'amount_USD_mint': 'sum'})
            #.add_column("mint_event", value="mint")
           )

    rebalance_redeem_amt = (raw_rebalance_df
                .query("amount_USD < 0")
                .set_index('timestamp')
                .rename_column('amount_USD', 'amount_USD_redeem')
                .resample('1D').agg({'amount_USD_redeem': 'sum'})
                #.add_column("redeem_event", value="redeem")
            )

    #Refactor this block to use Janitor
    rebalance_df_daily = pd.concat([rebalance_df_daily_events, rebalance_mint_amt, rebalance_redeem_amt], axis=1)
    rebalance_df_daily = rebalance_df_daily.fillna(0)
    rebalance_df_daily['amount_USD'] = rebalance_df_daily['amount_USD_mint'] + rebalance_df_daily['amount_USD_redeem']

    filters = [
    rebalance_df_daily.amount_USD > 0,
    rebalance_df_daily.amount_USD < 0,
    rebalance_df_daily.amount_USD == 0
    ]
    values = ["mint", "redeem", None]

    rebalance_df_daily['event'] = np.select(filters, values)

    return rebalance_df_daily


#Maybe put the load_df() in main.py or just change this to main.py
def process_data():
    #Load in raw DF
    df = load_df()
    print('DF loaded.')
    #Get blocktimestamps from raw_df
    requests_df = get_block_timestamps(df)
    print('Timestamps retrieved.')

    #Add hist eth prices to requests_df
    requests_df = get_hist_eth_price(requests_df)
    print('Prices retrieved.')


    df = df.merge(requests_df, how='inner', on='block_number')
    print('DF merged w/ timestamps + prices.')

    deposit_df, withdraw_df, raw_rebalance_df = process_event_dfs(df)
    print("Event DF's created.")


    USDL_df = get_USDL_balance_df(deposit_df, withdraw_df)
    rebalance_df = get_rebalance_df(raw_rebalance_df)

    USDL_df.to_parquet('data/results/USDL_df_03-19-22.parquet')
    rebalance_df.to_parquet('data/results/rebalance_df_03-19-22.parquet')
    print("Parquet's saved.")

process_data()



