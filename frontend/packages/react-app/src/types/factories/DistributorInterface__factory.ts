/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { DistributorInterface } from "../DistributorInterface";

export class DistributorInterface__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _distributorInfoCid: string,
    _link: string,
    overrides?: Overrides
  ): Promise<DistributorInterface> {
    return super.deploy(
      _distributorInfoCid,
      _link,
      overrides || {}
    ) as Promise<DistributorInterface>;
  }
  getDeployTransaction(
    _distributorInfoCid: string,
    _link: string,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(
      _distributorInfoCid,
      _link,
      overrides || {}
    );
  }
  attach(address: string): DistributorInterface {
    return super.attach(address) as DistributorInterface;
  }
  connect(signer: Signer): DistributorInterface__factory {
    return super.connect(signer) as DistributorInterface__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DistributorInterface {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as DistributorInterface;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_distributorInfoCid",
        type: "string",
      },
      {
        internalType: "address",
        name: "_link",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "campaign",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "CreateCampaign",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "campaignList",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "distributorInfoCid",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "link",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextCampaignId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenHolder",
        type: "address",
      },
      {
        internalType: "string",
        name: "campaignInfoCid",
        type: "string",
      },
      {
        internalType: "string",
        name: "recipientsCid",
        type: "string",
      },
      {
        internalType: "uint32",
        name: "recipientsNum",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "startDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endDate",
        type: "uint256",
      },
    ],
    name: "createCampaign",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6080604052600160025534801561001557600080fd5b506040516106863803806106868339818101604052604081101561003857600080fd5b810190808051604051939291908464010000000082111561005857600080fd5b8382019150602082018581111561006e57600080fd5b825186600182028301116401000000008211171561008b57600080fd5b8083526020830192505050908051906020019080838360005b838110156100bf5780820151818401526020810190506100a4565b50505050905090810190601f1680156100ec5780820380516001836020036101000a031916815260200191505b5060405260200180519060200190929190505050816000908051906020019061011692919061015f565b5080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050506101fc565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101a057805160ff19168380011785556101ce565b828001600101855582156101ce579182015b828111156101cd5782518255916020019190600101906101b2565b5b5090506101db91906101df565b5090565b5b808211156101f85760008160009055506001016101e0565b5090565b61047b8061020b6000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80631c4695f41461005c57806323238848146100905780634912c65814610113578063504d22891461016b5780637903a75614610321575b600080fd5b61006461033f565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610098610365565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100d85780820151818401526020810190506100bd565b50505050905090810190601f1680156101055780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61013f6004803603602081101561012957600080fd5b8101908080359060200190929190505050610403565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61031f600480360360e081101561018157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156101de57600080fd5b8201836020820111156101f057600080fd5b8035906020019184600183028401116401000000008311171561021257600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561027557600080fd5b82018360208201111561028757600080fd5b803590602001918460018302840111640100000000831117156102a957600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803563ffffffff1690602001909291908035906020019092919080359060200190929190505050610436565b005b61032961043f565b6040518082815260200191505060405180910390f35b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103fb5780601f106103d0576101008083540402835291602001916103fb565b820191906000526020600020905b8154815290600101906020018083116103de57829003601f168201915b505050505081565b60036020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b50505050505050565b6002548156fea2646970667358221220aab667e0ea570a1eec7c8d2fca9836ad0f8923a9bb17de326662c7daac95248864736f6c634300060c0033";
