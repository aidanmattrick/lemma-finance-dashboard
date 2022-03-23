import pandas as pd

def test(data, context):
    df = pd.read_parquet('gs://lemma-test-dash/USALemma_raw_latest.parquet')
    print(df.shape)


