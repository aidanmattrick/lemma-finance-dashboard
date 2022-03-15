'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var querystring = require('querystring');

var USDLemmaABI = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "dexIndex",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "collateral",
				type: "address"
			},
			{
				indexed: false,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "collateralRequired",
				type: "uint256"
			}
		],
		name: "DepositTo",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "newFees",
				type: "uint256"
			}
		],
		name: "FeesUpdated",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "current",
				type: "address"
			}
		],
		name: "LemmaTreasuryUpdated",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "OwnershipTransferred",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "dexIndex",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "collateral",
				type: "address"
			},
			{
				indexed: false,
				internalType: "address",
				name: "dexWrapper",
				type: "address"
			}
		],
		name: "PerpetualDexWrapperAdded",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "dexIndex",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "collateral",
				type: "address"
			},
			{
				indexed: false,
				internalType: "int256",
				name: "amount",
				type: "int256"
			}
		],
		name: "Rebalance",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "current",
				type: "address"
			}
		],
		name: "StakingContractUpdated",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "dexIndex",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "collateral",
				type: "address"
			},
			{
				indexed: false,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "collateralGotBack",
				type: "uint256"
			}
		],
		name: "WithdrawTo",
		type: "event"
	},
	{
		inputs: [
		],
		name: "DOMAIN_SEPARATOR",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "perpetualDEXIndex",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "collateralAddress",
				type: "address"
			},
			{
				internalType: "address",
				name: "perpetualDEXWrapperAddress",
				type: "address"
			}
		],
		name: "addPerpetualDEXWrapper",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			}
		],
		name: "allowance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "decimals",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "subtractedValue",
				type: "uint256"
			}
		],
		name: "decreaseAllowance",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "perpetualDEXIndex",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "maxCollateralAmountRequired",
				type: "uint256"
			},
			{
				internalType: "contract IERC20Upgradeable",
				name: "collateral",
				type: "address"
			}
		],
		name: "deposit",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "perpetualDEXIndex",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "maxCollateralAmountRequired",
				type: "uint256"
			},
			{
				internalType: "contract IERC20Upgradeable",
				name: "collateral",
				type: "address"
			}
		],
		name: "depositTo",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "fees",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "addedValue",
				type: "uint256"
			}
		],
		name: "increaseAllowance",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "trustedForwarder",
				type: "address"
			},
			{
				internalType: "address",
				name: "collateralAddress",
				type: "address"
			},
			{
				internalType: "address",
				name: "perpetualDEXWrapperAddress",
				type: "address"
			}
		],
		name: "initialize",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "forwarder",
				type: "address"
			}
		],
		name: "isTrustedForwarder",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "lemmaTreasury",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "nonces",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "permit",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "perpetualDEXWrappers",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "perpetualDEXIndex",
				type: "uint256"
			},
			{
				internalType: "contract IERC20Upgradeable",
				name: "collateral",
				type: "address"
			},
			{
				internalType: "int256",
				name: "amount",
				type: "int256"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "reBalance",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "renounceOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_fees",
				type: "uint256"
			}
		],
		name: "setFees",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_lemmaTreasury",
				type: "address"
			}
		],
		name: "setLemmaTreasury",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_stakingContractAddress",
				type: "address"
			}
		],
		name: "setStakingContractAddress",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "stakingContractAddress",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "transfer",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "transferOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "perpetualDEXIndex",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "minCollateralAmountToGetBack",
				type: "uint256"
			},
			{
				internalType: "contract IERC20Upgradeable",
				name: "collateral",
				type: "address"
			}
		],
		name: "withdraw",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "perpetualDEXIndex",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "minCollateralAmountToGetBack",
				type: "uint256"
			},
			{
				internalType: "contract IERC20Upgradeable",
				name: "collateral",
				type: "address"
			}
		],
		name: "withdrawTo",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

// import { XUSDLemma } from './contracts/xUSDLemma';  REVISIT once source code verified
const addresses = {
    USD_LEMMA: '0xdb41ab644AbcA7f5ac579A5Cf2F41e606C2d6abc',
    XUSD_Lemma: '0x57c7e0d43c05bce429ce030132ca40f6fa5839d7',
};
const parquet = require('parquetjs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://arb-mainnet.g.alchemy.com/v2/S6gNm0Rzgv7UBu3ztTC1iDbNX0vhoT9m'));
let failedBlocks = [];
// Parquet table
let schema = new parquet.ParquetSchema({
    event: { type: 'UTF8' },
    contract_address: { type: 'UTF8' },
    block_number: { type: 'UTF8' },
    tx_hash: { type: 'UTF8' },
    return_values: { type: 'UTF8' },
});
//main function
const writeToParquet = async (fileName) => {
    const latestBlock = await web3.eth.getBlockNumber();
    console.log(latestBlock);
    var writer = await parquet.ParquetWriter.openFile(schema, fileName); //removed await
    await pull_data(writer, 0, latestBlock);
    await writer.close();
};
//main data function
async function pull_data(writer, startBlock = 0, latestBlock) {
    for (let i = startBlock; i <= latestBlock; i += 2000) { //used to be 2000
        let fromBlock = i;
        let toBlock = i + 1999;
        if (fromBlock % 100000 === 0) {
            console.log("Progress is " + ((fromBlock / latestBlock) * 100).toFixed(2).toString() + "% complete.");
        }
        try {
            await get_data_blocks(writer, fromBlock, toBlock);
        }
        catch (err) {
            failedBlocks.push(fromBlock.toString() + "," + toBlock.toString());
        }
    }
}
//get data between blocks
async function get_data_blocks(writer, fromBlock, toBlock) {
    const USDLemma = new web3.eth.Contract(USDLemmaABI, addresses.USD_LEMMA);
    //const XUSDLemma = new web3.eth.Contract(xUSDLemmaABI as any, addresses.XUSD_Lemma) as unknown as XUSDLemma;
    const lemmaEvents = await USDLemma.getPastEvents('allEvents', {
        fromBlock: fromBlock,
        toBlock: toBlock //refactor to make sure not pulling extra blocks//currently deduping w/ Pandas
    });
    const appendRows = lemmaEvents.map(evt => {
        return writer.appendRow({
            event: evt.event,
            contract_address: evt.address,
            block_number: evt.blockNumber.toString(),
            tx_hash: evt.transactionHash,
            return_values: querystring.stringify(evt.returnValues),
        });
    });
    await Promise.all(appendRows);
}
writeToParquet('data/raw/USDLemma.parquet');
console.log(failedBlocks); //show all failed blocks

exports.writeToParquet = writeToParquet;
//# sourceMappingURL=index.cjs.map
