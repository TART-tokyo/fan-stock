import {
  CampaignInfo,
  CampaignMetadata,
  TokenInformationState,
} from "../interfaces";
import { EventData } from "web3-eth-contract";

export const campaignMetadata: CampaignMetadata = {
  name: "A Campaign",
  description: "This is a test campaign",
  image: "",
};

export const campaign: CampaignInfo = {
  id: "0xcampaign...1234",
  distributor: {
    id: "0xdistributor...1234",
    distributorCid: "Qmf8C4mjVGgzxVzWcAevxCHZiCCUG38rxeDC7Byt5tsVoA",
    distributorMetadata: {
      name: "Audius Followers Distributor",
      description:
        "This distributer enables creators to distributes tokens for their followers on Auduis.",
      image: "https://example.com/distributerimage.jpg",
    },
  },
  token: "0xtoken...1234",
  startDate: "1612137600",
  endDate: "1612137600",
  creator: {},
  campaignInfoCid: "cid",
  recipientsCid: "",
  claimAmount: "100",
  claimedNum: 10,
  status: 0,
  claims: [],
  checkRequests: [],
  campaignMetadata: campaignMetadata,
};

// from: https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#id41
const event: EventData = {
  returnValues: {
    myIndexedParam: 20,
    myOtherIndexedParam: "0x123456789...",
    myNonIndexParam: "My String",
  },
  raw: {
    data:
      "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385",
    topics: [
      "0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7",
      "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385",
    ],
  },
  event: "MyEvent",
  signature:
    "0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7",
  logIndex: 0,
  transactionIndex: 0,
  transactionHash:
    "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385",
  blockHash:
    "0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7",
  blockNumber: 1234,
  address: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
};

export const tokenInformationState: TokenInformationState = {
  token: {
    tokenAddress: "0xabcd...1234",
    name: "Iroiro Token",
    symbol: "IRO",
    decimals: 18,
    totalSupply: 2000000000,
  },
  isTokenApproved: true,
  isTokenRequested: false,
  campaigns: [
    campaign,
    {
      ...campaign,
      status: 1,
    },
    {
      ...campaign,
      status: 2,
    },
  ],
  isCampaignClaimable: false,
  isCampaignClaimed: false,
  userAddress: "0x0000000000000000000000000000000000000000",
  userBalance: "1234500000",
  campaignAddress: "0xcampaign...1234",
  activities: [
    {
      name: "Claim",
      timestamp: "1612137600",
      amount: "100",
    },
    {
      name: "Donate",
      timestamp: "1612137600",
      amount: "200",
    },
    {
      name: "Transfer",
      timestamp: "1612137600",
      amount: "300",
    },
  ],
  balances: [
    {
      timestamp: 1577836800000,
      balance: "100",
    },
    {
      timestamp: 1580515200000,
      balance: "200",
    },
    {
      timestamp: 1583020800000,
      balance: "300",
    },
    {
      timestamp: 1585699200000,
      balance: "400",
    },
    {
      timestamp: 1588291200000,
      balance: "300",
    },
  ],
};
