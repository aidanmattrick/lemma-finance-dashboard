import pandas as pd

def test():
    df = pd.read_parquet('gs://lemma-test-dash/USALemma_raw_latest.parquet')
    print(df.shape)


