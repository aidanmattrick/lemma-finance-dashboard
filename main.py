import pandas as pd

#https://cloud.google.com/functions/docs/writing/background#cloud-storage-example
def test(event, context):
    print(event['name'])
    print(context)
    df = pd.read_parquet('gs://lemma_dash_test/USALemma_raw_latest.parquet')
    print(df.shape)


