import USDLemmaABI from './abi/USDLemma.json';
//import xUSDLemmaABI from './abi/xUSDLemma.json'; REVISIT once source code verified
// import { XUSDLemma } from './contracts/xUSDLemma';  REVISIT once source code verified
import { USDLemma } from "./contracts/USDLemma";
import { stringify } from "querystring";
import { Storage } from '@google-cloud/storage';
import os from 'os';
import fsLibrary from 'fs';

const addresses = {
  USD_LEMMA: '0xdb41ab644AbcA7f5ac579A5Cf2F41e606C2d6abc', //Proxy address but using Implementation ABI 0xb8f9632e8d3cfaf84c254d98aea182a33a9d11bb
  XUSD_Lemma: '0x57c7e0d43c05bce429ce030132ca40f6fa5839d7',
}

//import parquet from 'parquetjs';
import { ParquetSchema, ParquetWriter } from 'parquets';
import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider('https://arb-mainnet.g.alchemy.com/v2/S6gNm0Rzgv7UBu3ztTC1iDbNX0vhoT9m'));
let failedBlocks: string[] = [];

// Parquet table
let schema = new ParquetSchema({
  event: { type: 'UTF8' },
  contract_address: { type: 'UTF8' },
  block_number: { type: 'UTF8'},
  tx_hash: { type: 'UTF8'},
  return_values: { type: 'UTF8'},
});

//main function
export const writeToParquet = async (fileName: string, startBlock: any) => {
  const latestBlock = await web3.eth.getBlockNumber();
  console.log(latestBlock);
  var writer = await ParquetWriter.openFile(schema, fileName); //removed await
  //Append null row in case no events happened in block range
  await writer.appendRow({event: 'Null', contract_address: 'Null', block_number: 'Null', tx_hash:'Null', return_values:'Null'});
  //await pull_data(writer, startBlock, latestBlock)
  await pull_data(writer, startBlock, 8054332);
  await writer.close();
}

//main data function
async function pull_data(writer, startBlock = 0, latestBlock): Promise<void> {
  for (let i = startBlock; i <= latestBlock; i+= 2000) {
    let fromBlock = i
    let toBlock = i + 1999
    if (fromBlock % 100000 === 0) {
      console.log("Progress is " + ((startBlock / latestBlock) * 100).toFixed(2).toString() + "% complete.");
    }
    try {
      await get_data_blocks(writer, fromBlock, toBlock);
    }
    catch(err){
     failedBlocks.push(fromBlock.toString()+","+toBlock.toString());
     console.error(err);
    }
  }
}

//get data between blocks
async function get_data_blocks(writer, fromBlock: number, toBlock: number,): Promise<void> {
  const USDLemma = new web3.eth.Contract(USDLemmaABI as any, addresses.USD_LEMMA) as unknown as USDLemma;
  //const XUSDLemma = new web3.eth.Contract(xUSDLemmaABI as any, addresses.XUSD_Lemma) as unknown as XUSDLemma;
  const lemmaEvents = await USDLemma.getPastEvents('allEvents', {
      fromBlock: fromBlock,
      toBlock: toBlock //refactor to make sure not pulling extra blocks//currently deduping w/ Pandas
  })

  try {
    await Promise.all(
      lemmaEvents.map(evt => { //collecting series of promises as an array...
      return writer.appendRow({
        event: evt.event, //if 'all'
        contract_address: evt.address,
        block_number: evt.blockNumber.toString(),
        tx_hash: evt.transactionHash,
        return_values: stringify(evt.returnValues),
        });
      }));
    }
  catch(err){
    console.error(err);
  }
}

export async function writeRawData() {
  const storage = new Storage();
  const bucket = storage.bucket('lemma_dash_test');
  const remoteFile = bucket.file('last_block.txt');
  console.log('Current directory: ' + process.cwd());
  const temp_dir = os.tmpdir();
  console.log(temp_dir);

  const downloadFile = async () => {
    const file = await remoteFile.download();
    return file.toString();
  }

  let startBlock = await downloadFile();

  //LOCAL:
  //let startBlock = 8054330

  try {
    console.log('Crawling starting at block ' + startBlock + '...');
    //LOCAL:
    //await writeToParquet('data/raw/USDLemma_raw_latest_TEST.parquet', startBlock);
    //GCF:
    await writeToParquet(temp_dir + '/USDLemma_raw_latest.parquet', parseInt(startBlock));
    await bucket.upload(temp_dir + '/USDLemma_raw_latest.parquet');
    console.log('Uploaded raw data to bucket.');
  }
  catch(err) {
    console.error(err);
  }

  //Write last block crawled to txt file in tmp dir
  let latestBlock = (await web3.eth.getBlockNumber()).toString();

  console.log('Wrote last block crawled (' + latestBlock + ') to last_block.txt');

  await fsLibrary.promises.writeFile(temp_dir + '/last_block_TEST.txt', latestBlock);

  //Upload to bucket
  await bucket.upload(temp_dir + '/last_block_TEST.txt');
  console.log('Uploaded last_block.txt to bucket.');

  //Log out failed blocks
  if (failedBlocks.length > 0) {
    console.log('FOLLOWING BLOCKS FAILED:');
    console.log(failedBlocks);
  }
}

//NEED TO HANDLE CASE IN WHICH PARQUET FILE IS 0 ROWS...

//writeRawData();

