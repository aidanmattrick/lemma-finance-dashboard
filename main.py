import pandas as pd
from src.process_data import process_data
#import config
#from config import covalent_api_key as covalent_api_key

def append_to_raw_main():
    #Stack raw_latest on raw_main
    raw_main_df = (pd
                   .read_parquet('gs://lemma_dash/USDLemma_raw_main.parquet')
                  )
    raw_latest_df = (pd
                     .read_parquet('gs://lemma_dash/USDLemma_raw_latest.parquet')
                     .query("event != 'Null' & contract_address != 'Null' & block_number != 'Null'")
                    )
    raw_main_updated = pd.concat([raw_main_df, raw_latest_df])
    #It overwrites...
    raw_main_updated.to_parquet('gs://lemma_dash/USDLemma_raw_main.parquet')
    return raw_main_updated


def main_loop(event, context):
    #REALTIME:
    if event['name'] == 'USDLemma_raw_latest.parquet':
        print('USDLemma_raw_latest updated...')
        raw_latest_df = pd.read_parquet('gs://lemma_dash/USDLemma_raw_latest.parquet')
        if raw_latest_df.shape[0] < 2:
            print('No new data was uploaded to USDLemma_raw_latest.')
            print('Wrapping up function.')
            return
        else:
            print('New data being processed...')
            covalent_api_key = pd.read_csv('gs://lemma_dash_api_key/api_key.csv')['covalent_api_key'][0]
            raw_df = append_to_raw_main()
            process_data(raw_df, covalent_api_key)
            print('Main loop finished executing.')
            return
    else:
        print('Another event, not trigger happened')
        return

    # #FOR TESTING:
    # print('Starting testing loop...')
    # covalent_api_key = pd.read_csv('gs://lemma_dash_api_key/api_key.csv')['covalent_api_key'][0]
    # print('New data being processed...')
    # raw_df = append_to_raw_main()
    # print('Raw appended.')
    # process_data(raw_df, covalent_api_key)
    # print('Main loop finished executing.')
    # return




