import pandas as pd

#https://cloud.google.com/functions/docs/writing/background#cloud-storage-example
def test(event, context):
    print(event)
    if event['name'] == 'USDLemma_raw_latest':
        df = pd.read_parquet('gs://lemma_dash/USDLemma_raw_latest.parquet')
        print(df.shape)
        df.to_parquet('gs://lemma_dash/TEST_PARQ.parquet')
        print('Executed.')

# fs = gcsfs.GCSFileSystem(project='my-project')
# with fs.open('bucket/path.csv') as f:
#     df = pd.read_csv(f)

