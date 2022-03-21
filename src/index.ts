import USDLemmaABI from './abi/USDLemma.json';
//import xUSDLemmaABI from './abi/xUSDLemma.json'; REVISIT once source code verified
import { USDLemma } from "./contracts/USDLemma";
import { stringify } from "querystring";
// import { XUSDLemma } from './contracts/xUSDLemma';  REVISIT once source code verified
import { Storage } from '@google-cloud/storage';
import os from 'os';
const fsLibrary  = require('fs');

const addresses = {
  USD_LEMMA: '0xdb41ab644AbcA7f5ac579A5Cf2F41e606C2d6abc', //Proxy address but using Implementation ABI 0xb8f9632e8d3cfaf84c254d98aea182a33a9d11bb
  XUSD_Lemma: '0x57c7e0d43c05bce429ce030132ca40f6fa5839d7',
}

const parquet = require('parquetjs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://arb-mainnet.g.alchemy.com/v2/S6gNm0Rzgv7UBu3ztTC1iDbNX0vhoT9m'));
let failedBlocks: string[] = [];


// Parquet table
let schema = new parquet.ParquetSchema({
  event: { type: 'UTF8' },
  contract_address: { type: 'UTF8' },
  block_number: { type: 'UTF8'},
  tx_hash: { type: 'UTF8'},
  return_values: { type: 'UTF8'},
});

//main function
export const writeToParquet = async (fileName: string, startBlock: any) => {
  const latestBlock = await web3.eth.getBlockNumber()
  console.log(latestBlock);
  var writer = await parquet.ParquetWriter.openFile(schema, fileName); //removed await
  //await pull_data(writer, startBlock, latestBlock)
  await pull_data(writer, startBlock, 8054335)
  await writer.close();
}

//main data function
async function pull_data(writer, startBlock = 0, latestBlock): Promise<void> {
  for (let i = startBlock; i <= latestBlock; i+= 2000) {
    let fromBlock = i
    let toBlock = i + 1999
    if (fromBlock % 100000 === 0) {
      console.log("Progress is " + ((startBlock / latestBlock) * 100).toFixed(2).toString() + "% complete.")
    }
    try {
      await get_data_blocks(writer, fromBlock, toBlock);
    }
    catch(err){
     failedBlocks.push(fromBlock.toString()+","+toBlock.toString())
     console.error(err)
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
    console.error(err)
  }
}

export async function writeRawData() {
  const storage = new Storage();
  const bucket = storage.bucket('lemma_dash_test');
  const remoteFile = bucket.file('last_block.txt');
  console.log('Current directory: ' + process.cwd());
  const temp_dir = os.tmpdir();
  console.log(temp_dir);

  // await remoteFile.download(async function(err, contents) {
  //   console.log("file err: " + err);
  //   console.log("file data: " + contents);
  //   var startBlock = parseInt(contents.toString())
  //   console.log(startBlock)
  // });

  let startBlock = await remoteFile.download(async function(err, contents) {
    console.log("file err: " + err);
    console.log("file data: " + contents);
    let startBlock = parseInt(contents.toString());
    return startBlock;
  });

  try {
    console.log(startBlock)
    await writeToParquet(temp_dir + '/USDLemma_raw_latest.parquet', startBlock);
    console.log('wrote to Parquet in try.');
    await bucket.upload(temp_dir + '/USDLemma_raw_latest.parquet');
    console.log('Made it through try statement to upload to bucket.');
  }
  catch(err) {
    console.error(err)
  }
  console.log("Uploaded file to bucket!")

  //write last block crawled to txt file
  let latestBlock = await web3.eth.getBlockNumber();
  await fsLibrary.writeFile('last_block.txt', latestBlock, (err) => {
      if (err) throw console.error(err);
  });
  console.log('Wrote last block crawled (' + latestBlock.toString() + ') to last_block.txt')
}


//Below is code for diff async approach based on Stack Overflow post
//Trying to get working with await awaiter approach...
//https://stackoverflow.com/questions/66180561/proper-way-to-await-multiple-async-functions-with-google-cloud-functions-node-js

//COPY of main function - messing around with async approaches
// export const writeToParquet = async (fileName: string) => {
//   //let awaiter = new Promise((resolve) => {
//   const latestBlock = web3.eth.getBlockNumber()
//   console.log(latestBlock);
//   var writer = parquet.ParquetWriter.openFile(schema, fileName); //removed await
//   //await pull_data(writer, 0, latestBlock); 8171109
//   await pull_data(writer, 8054330, 8054335)
//   writer.close();
//   //resolve;
//   //});
//   //await awaiter;
// }

//COPY of GCF Main Function
//const writeRawData = async () => {

// exports.writeRawData = async () => {
//   const storage = new Storage();
//   const bucket = storage.bucket('lemma_dash_test');
//   console.log('Current directory: ' + process.cwd());
//   const temp_dir = os.tmpdir();
//   console.log(temp_dir);
//   let awaiter = new Promise<void>((resolve) => {
//   try {
//     //await writeToParquet(temp_dir + '/USDLemma_test_03-16-22.parquet');
//     writeToParquet(temp_dir + '/USDLemma_test_03-16-22.parquet');

//     //LOCAL
//     //writeToParquet('data/raw/USDLemma_test_03-16-22.parquet');

//     console.log('wrote to Parquet in try.')
//     bucket.upload(temp_dir + '/USDLemma_test_03-16-22.parquet', async function(err, file) {
//     console.log('Made it through try statement to upload to bucket.')
//     resolve();
//     });
//   }
//   catch(err) {
//     console.error(err)
//   }
//   });
//   await awaiter;
//   console.log("Uploaded file to bucket!");
// }

//WHEN RUNNING ON LOCAL UNCOMMENT:

//writeToParquet('data/raw/USDLemma_03-19-22.parquet');
console.log(failedBlocks); //show all failed blocks

writeRawData();
