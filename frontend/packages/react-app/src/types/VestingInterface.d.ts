/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface VestingInterfaceInterface extends ethers.utils.Interface {
  functions: {
    "addVesting(address,address,uint256,uint256)": FunctionFragment;
    "redeem(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addVesting",
    values: [string, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "redeem", values: [string]): string;

  decodeFunctionResult(functionFragment: "addVesting", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeem", data: BytesLike): Result;

  events: {};
}

export class VestingInterface extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: VestingInterfaceInterface;

  functions: {
    addVesting(
      token: string,
      recipient: string,
      vestingStart: BigNumberish,
      vestingEnd: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "addVesting(address,address,uint256,uint256)"(
      token: string,
      recipient: string,
      vestingStart: BigNumberish,
      vestingEnd: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    redeem(token: string, overrides?: Overrides): Promise<ContractTransaction>;

    "redeem(address)"(
      token: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  addVesting(
    token: string,
    recipient: string,
    vestingStart: BigNumberish,
    vestingEnd: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "addVesting(address,address,uint256,uint256)"(
    token: string,
    recipient: string,
    vestingStart: BigNumberish,
    vestingEnd: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  redeem(token: string, overrides?: Overrides): Promise<ContractTransaction>;

  "redeem(address)"(
    token: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    addVesting(
      token: string,
      recipient: string,
      vestingStart: BigNumberish,
      vestingEnd: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "addVesting(address,address,uint256,uint256)"(
      token: string,
      recipient: string,
      vestingStart: BigNumberish,
      vestingEnd: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    redeem(token: string, overrides?: CallOverrides): Promise<void>;

    "redeem(address)"(token: string, overrides?: CallOverrides): Promise<void>;
  };

  filters: {};

  estimateGas: {
    addVesting(
      token: string,
      recipient: string,
      vestingStart: BigNumberish,
      vestingEnd: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "addVesting(address,address,uint256,uint256)"(
      token: string,
      recipient: string,
      vestingStart: BigNumberish,
      vestingEnd: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    redeem(token: string, overrides?: Overrides): Promise<BigNumber>;

    "redeem(address)"(token: string, overrides?: Overrides): Promise<BigNumber>;
  };

  populateTransaction: {
    addVesting(
      token: string,
      recipient: string,
      vestingStart: BigNumberish,
      vestingEnd: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "addVesting(address,address,uint256,uint256)"(
      token: string,
      recipient: string,
      vestingStart: BigNumberish,
      vestingEnd: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    redeem(token: string, overrides?: Overrides): Promise<PopulatedTransaction>;

    "redeem(address)"(
      token: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}
