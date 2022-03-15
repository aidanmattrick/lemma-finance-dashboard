const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const bucket = storage.bucket('lemma_dash_test');
import { writeToParquet } from '/src/index.ts';

export function writeRawData() {
  bucket.upload('data/results/viz_df_daily_03-10-22.parquet', function(err, file) {
});
}