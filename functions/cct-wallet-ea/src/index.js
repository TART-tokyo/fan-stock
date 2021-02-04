/*
 *     Copyright (C) 2021 TART K.K.
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see https://www.gnu.org/licenses/.
 */

const ipfsClient = require("ipfs-http-client");
const Web3Utils = require("web3-utils");
const BN = require("bn.js");
const Web3 = require("web3");
let response;

const DistributorContract = require("./build/contracts/CCTWalletDistributor.json");
const distributorInterface = DistributorContract.abi;
const distributorAddress = process.env.DISTRIBUTOR_ADDRESS;
const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.HTTP_PROVIDER)
);
const Distributor = new web3.eth.Contract(
  distributorInterface,
  distributorAddress
);

const CampaignContract = require("./build/contracts/CCTWalletCampaign.json");
const campaignInterface = CampaignContract.abi;

const ipfs = ipfsClient("https://gateway.pinata.cloud/");

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);
  console.debug("request body: ", body);
  const rawUserId = body.data.userId;
  const campaignId = new BN(body.data.campaignId.toString());

  let campaignAddress;
  try {
    campaignAddress = await Distributor.methods
      .campaignList(campaignId.toString())
      .call();
    if (campaignAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error("Campaign is not exists.");
    }
  } catch (error) {
    console.error("Failed to get campaign address from campaign id.", error);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        jobRunID: body.id,
        data: {},
        status: "errored",
        error: "Failed to get campaign from campaign id.",
      }),
    };
    return response;
  }

  const Campaign = new web3.eth.Contract(campaignInterface, campaignAddress);
  let userAddress;
  try {
    userAddress = await Campaign.methods.userList(rawUserId).call();
  } catch (error) {
    console.error("Failed to get user address from user id.", error);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        jobRunID: body.id,
        data: {},
        status: "errored",
        error: "Failed to get user address from user id.",
      }),
    };
    return response;
  }
  const userId = new BN(rawUserId).mul(new BN(10));

  let content;
  try {
    content = await getFile(body.data.cid);
    if (!Array.isArray(content.targets)) {
      throw new Error("File does not contains target field.");
    }
  } catch (error) {
    console.error("Failed to get user addresses file. ", error);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        jobRunID: body.id,
        data: {},
        status: "errored",
        error: "Failed to get user addresses file.",
      }),
    };
    return response;
  }

  const isClaimable = content.targets.includes(userAddress.toLowerCase());
  const claimKeyHash = getClaimKeyHash(userId, isClaimable);
  console.debug("Claim key hash: ", claimKeyHash);

  response = {
    statusCode: 200,
    body: JSON.stringify({
      jobRunID: body.id,
      data: claimKeyHash,
    }),
  };
  return response;
};

const getClaimKeyHash = (userId, isClimable) => {
  const truthyValue = isClimable ? 1 : 0;
  const truthyBN = new BN(truthyValue);
  const claimKey = userId.add(truthyBN);
  console.debug("Claim key: ", claimKey.toString());

  return Web3Utils.soliditySha3(claimKey);
};

const getFile = async (cid) => {
  for await (const file of ipfs.get(cid)) {
    if (!file.content) {
      continue;
    }
    const content = [];
    for await (const chunk of file.content) {
      content.push(chunk);
    }
    return JSON.parse(content.toString());
  }
};
