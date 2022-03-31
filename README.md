# Lemma Finance Dashboard

Lemma is a DeFi protocol that uses a market neutral derivatives position to issu ea stablecoin and generate sustainable yield. To learn more and use the protocol visit the Lemma site [here](https://www.lemma.finance/).

This dashboard displays the TVL in Lemma, the amount of USDL in circulation, and information on rebalance events. It can be accessed [here](https://share.streamlit.io/aidanmattrick/lemma-finance-dashboard/main/streamlit_dash.py).

### Repo overview
- `/src` is in typescript (except for `process_data.py`) and is used to scrape data from Arbitrum using alchemy + web3.js
- `src/process_data.py` is used to process the raw data
- `streamlit_dash.py` is the file that streamlit uses to run dashboard

### Pipeline overview:
- Pipeline is run on Google Cloud Platform
- `/dist/cjs/index.js` runs every 15 minutes and uploads any raw data to a bucket
- If new data has been uploaded, `main.py` is triggered and processes that data, outputting the results to a public bucket (`lemma_dash_results`)
- `streamlit_dash.py` then reads the results from public bucket and creates visualizations.


