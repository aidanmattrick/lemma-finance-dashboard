import pandas as pd

#https://cloud.google.com/functions/docs/writing/background#cloud-storage-example
def test(event, context):
    print(event)
    print(context)
    df = pd.read_parquet('gs://lemma_dash_test/USDLemma_raw_latest.parquet')
    print(df.shape)

# fs = gcsfs.GCSFileSystem(project='my-project')
# with fs.open('bucket/path.csv') as f:
#     df = pd.read_csv(f)

