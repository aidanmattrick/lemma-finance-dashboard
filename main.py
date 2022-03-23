import pandas as pd
from src.process_data import process_data


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
    #Change name see if it overwrites...
    raw_main_updated.to_parquet('gs://lemma_dash/TEST_PARQ.parquet')
    return raw_main_updated


#RENAME TO MAIN
def test(event, context):
    print(event)
    if event['name'] == 'USDLemma_raw_latest':
        print('USDLemma_raw_latest updated...')
        raw_latest_df = pd.read_parquet('gs://lemma_dash/USDLemma_raw_latest.parquet')
        if raw_latest_df.shape[0] < 2:
            print('No new data was uploaded to USDLemma_raw_latest.')
            print('Wrapping up function.')
            return
        else:
            print('New data being processed...')
            raw_df = append_to_raw_main()
            #raw_df = pd.read_parquet('gs://lemma_dash/USDLemma_raw_latest.parquet')
            process_data(raw_df)
            print('Main loop finished executing.')


