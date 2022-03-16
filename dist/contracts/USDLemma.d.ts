/// <reference types="node" />
import BN from "bn.js";
import { ContractOptions } from "web3-eth-contract";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import { Callback, NonPayableTransactionObject, BlockType, ContractEventLog, BaseContract } from "./types";
export interface EventOptions {
    filter?: object;
    fromBlock?: BlockType;
    topics?: string[];
}
export declare type Approval = ContractEventLog<{
    owner: string;
    spender: string;
    value: string;
    0: string;
    1: string;
    2: string;
}>;
export declare type DepositTo = ContractEventLog<{
    dexIndex: string;
    collateral: string;
    to: string;
    amount: string;
    collateralRequired: string;
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
}>;
export declare type FeesUpdated = ContractEventLog<{
    newFees: string;
    0: string;
}>;
export declare type LemmaTreasuryUpdated = ContractEventLog<{
    current: string;
    0: string;
}>;
export declare type OwnershipTransferred = ContractEventLog<{
    previousOwner: string;
    newOwner: string;
    0: string;
    1: string;
}>;
export declare type PerpetualDexWrapperAdded = ContractEventLog<{
    dexIndex: string;
    collateral: string;
    dexWrapper: string;
    0: string;
    1: string;
    2: string;
}>;
export declare type Rebalance = ContractEventLog<{
    dexIndex: string;
    collateral: string;
    amount: string;
    0: string;
    1: string;
    2: string;
}>;
export declare type StakingContractUpdated = ContractEventLog<{
    current: string;
    0: string;
}>;
export declare type Transfer = ContractEventLog<{
    from: string;
    to: string;
    value: string;
    0: string;
    1: string;
    2: string;
}>;
export declare type WithdrawTo = ContractEventLog<{
    dexIndex: string;
    collateral: string;
    to: string;
    amount: string;
    collateralGotBack: string;
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
}>;
export interface USDLemma extends BaseContract {
    constructor(jsonInterface: any[], address?: string, options?: ContractOptions): USDLemma;
    clone(): USDLemma;
    methods: {
        DOMAIN_SEPARATOR(): NonPayableTransactionObject<string>;
        addPerpetualDEXWrapper(perpetualDEXIndex: number | string | BN, collateralAddress: string, perpetualDEXWrapperAddress: string): NonPayableTransactionObject<void>;
        allowance(owner: string, spender: string): NonPayableTransactionObject<string>;
        approve(spender: string, amount: number | string | BN): NonPayableTransactionObject<boolean>;
        balanceOf(account: string): NonPayableTransactionObject<string>;
        decimals(): NonPayableTransactionObject<string>;
        decreaseAllowance(spender: string, subtractedValue: number | string | BN): NonPayableTransactionObject<boolean>;
        deposit(amount: number | string | BN, perpetualDEXIndex: number | string | BN, maxCollateralAmountRequired: number | string | BN, collateral: string): NonPayableTransactionObject<void>;
        depositTo(to: string, amount: number | string | BN, perpetualDEXIndex: number | string | BN, maxCollateralAmountRequired: number | string | BN, collateral: string): NonPayableTransactionObject<void>;
        fees(): NonPayableTransactionObject<string>;
        increaseAllowance(spender: string, addedValue: number | string | BN): NonPayableTransactionObject<boolean>;
        initialize(trustedForwarder: string, collateralAddress: string, perpetualDEXWrapperAddress: string): NonPayableTransactionObject<void>;
        isTrustedForwarder(forwarder: string): NonPayableTransactionObject<boolean>;
        lemmaTreasury(): NonPayableTransactionObject<string>;
        name(): NonPayableTransactionObject<string>;
        nonces(owner: string): NonPayableTransactionObject<string>;
        owner(): NonPayableTransactionObject<string>;
        permit(owner: string, spender: string, value: number | string | BN, deadline: number | string | BN, v: number | string | BN, r: string | number[], s: string | number[]): NonPayableTransactionObject<void>;
        perpetualDEXWrappers(arg0: number | string | BN, arg1: string): NonPayableTransactionObject<string>;
        reBalance(perpetualDEXIndex: number | string | BN, collateral: string, amount: number | string | BN, data: string | number[]): NonPayableTransactionObject<void>;
        renounceOwnership(): NonPayableTransactionObject<void>;
        setFees(_fees: number | string | BN): NonPayableTransactionObject<void>;
        setLemmaTreasury(_lemmaTreasury: string): NonPayableTransactionObject<void>;
        setStakingContractAddress(_stakingContractAddress: string): NonPayableTransactionObject<void>;
        stakingContractAddress(): NonPayableTransactionObject<string>;
        symbol(): NonPayableTransactionObject<string>;
        totalSupply(): NonPayableTransactionObject<string>;
        transfer(recipient: string, amount: number | string | BN): NonPayableTransactionObject<boolean>;
        transferFrom(sender: string, recipient: string, amount: number | string | BN): NonPayableTransactionObject<boolean>;
        transferOwnership(newOwner: string): NonPayableTransactionObject<void>;
        withdraw(amount: number | string | BN, perpetualDEXIndex: number | string | BN, minCollateralAmountToGetBack: number | string | BN, collateral: string): NonPayableTransactionObject<void>;
        withdrawTo(to: string, amount: number | string | BN, perpetualDEXIndex: number | string | BN, minCollateralAmountToGetBack: number | string | BN, collateral: string): NonPayableTransactionObject<void>;
    };
    events: {
        Approval(cb?: Callback<Approval>): EventEmitter;
        Approval(options?: EventOptions, cb?: Callback<Approval>): EventEmitter;
        DepositTo(cb?: Callback<DepositTo>): EventEmitter;
        DepositTo(options?: EventOptions, cb?: Callback<DepositTo>): EventEmitter;
        FeesUpdated(cb?: Callback<FeesUpdated>): EventEmitter;
        FeesUpdated(options?: EventOptions, cb?: Callback<FeesUpdated>): EventEmitter;
        LemmaTreasuryUpdated(cb?: Callback<LemmaTreasuryUpdated>): EventEmitter;
        LemmaTreasuryUpdated(options?: EventOptions, cb?: Callback<LemmaTreasuryUpdated>): EventEmitter;
        OwnershipTransferred(cb?: Callback<OwnershipTransferred>): EventEmitter;
        OwnershipTransferred(options?: EventOptions, cb?: Callback<OwnershipTransferred>): EventEmitter;
        PerpetualDexWrapperAdded(cb?: Callback<PerpetualDexWrapperAdded>): EventEmitter;
        PerpetualDexWrapperAdded(options?: EventOptions, cb?: Callback<PerpetualDexWrapperAdded>): EventEmitter;
        Rebalance(cb?: Callback<Rebalance>): EventEmitter;
        Rebalance(options?: EventOptions, cb?: Callback<Rebalance>): EventEmitter;
        StakingContractUpdated(cb?: Callback<StakingContractUpdated>): EventEmitter;
        StakingContractUpdated(options?: EventOptions, cb?: Callback<StakingContractUpdated>): EventEmitter;
        Transfer(cb?: Callback<Transfer>): EventEmitter;
        Transfer(options?: EventOptions, cb?: Callback<Transfer>): EventEmitter;
        WithdrawTo(cb?: Callback<WithdrawTo>): EventEmitter;
        WithdrawTo(options?: EventOptions, cb?: Callback<WithdrawTo>): EventEmitter;
        allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
    };
    once(event: "Approval", cb: Callback<Approval>): void;
    once(event: "Approval", options: EventOptions, cb: Callback<Approval>): void;
    once(event: "DepositTo", cb: Callback<DepositTo>): void;
    once(event: "DepositTo", options: EventOptions, cb: Callback<DepositTo>): void;
    once(event: "FeesUpdated", cb: Callback<FeesUpdated>): void;
    once(event: "FeesUpdated", options: EventOptions, cb: Callback<FeesUpdated>): void;
    once(event: "LemmaTreasuryUpdated", cb: Callback<LemmaTreasuryUpdated>): void;
    once(event: "LemmaTreasuryUpdated", options: EventOptions, cb: Callback<LemmaTreasuryUpdated>): void;
    once(event: "OwnershipTransferred", cb: Callback<OwnershipTransferred>): void;
    once(event: "OwnershipTransferred", options: EventOptions, cb: Callback<OwnershipTransferred>): void;
    once(event: "PerpetualDexWrapperAdded", cb: Callback<PerpetualDexWrapperAdded>): void;
    once(event: "PerpetualDexWrapperAdded", options: EventOptions, cb: Callback<PerpetualDexWrapperAdded>): void;
    once(event: "Rebalance", cb: Callback<Rebalance>): void;
    once(event: "Rebalance", options: EventOptions, cb: Callback<Rebalance>): void;
    once(event: "StakingContractUpdated", cb: Callback<StakingContractUpdated>): void;
    once(event: "StakingContractUpdated", options: EventOptions, cb: Callback<StakingContractUpdated>): void;
    once(event: "Transfer", cb: Callback<Transfer>): void;
    once(event: "Transfer", options: EventOptions, cb: Callback<Transfer>): void;
    once(event: "WithdrawTo", cb: Callback<WithdrawTo>): void;
    once(event: "WithdrawTo", options: EventOptions, cb: Callback<WithdrawTo>): void;
}
