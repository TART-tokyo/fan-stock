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

import { Distributor } from "../interfaces";

// ID must be lowercase
const distributors: Distributor[] = [
  {
    id: process.env.REACT_APP_CONTRACT_WALLETDISTRIBUTOR ?? "",
    distributorCid: "Qmf8C4mjVGgzxVzWcAevxCHZiCCUG38rxeDC7Byt5tsVoA",
    distributorMetadata: {
      name: "Wallet Address",
      description:
        "To distribute ERC20 tokens to a list of addresses that you have.",
    },
    type: "wallet",
    version: "",
    disabled: false,
  },
  {
    id: process.env.REACT_APP_CONTRACT_WALLETNFTDISTRIBUTOR ?? "",
    distributorCid: "QmXKRJGq5iR7Km5Pz7yEtj8nHesuSFZo2omfWxXVCF3pJU",
    distributorMetadata: {
      name: "Wallet Address",
      description: "To distribute NFT to a list of addresses that you have.",
    },
    type: "wallet-nft",
    version: "",
    disabled: false,
  },
  {
    id: process.env.REACT_APP_CONTRACT_UUIDDISTRIBUTOR ?? "",
    distributorCid: "Qma51KJaSdehSWv7JZUzyib7U2pz6JttUNA2wTETn3dbCY",
    distributorMetadata: {
      name: "URL",
      description: "To distribute ERC20 tokens with a unique URL per user.",
    },
    type: "uuid",
    version: "",
    disabled: false,
  },
  {
    id: process.env.REACT_APP_CONTRACT_UUIDNFTDISTRIBUTOR ?? "",
    distributorCid: "QmbHWRsKbxVFQ8fC7JbS1E7fuax1tLAgVKs2VzrkpB1Tvj",
    distributorMetadata: {
      name: "URL",
      description: "To distribute NFT with a unique URL per user.",
    },
    type: "uuid-nft",
    version: "",
    disabled: false,
  },
  {
    id: process.env.REACT_APP_CONTRACT_UUIDDISTRIBUTOR ?? "",
    distributorCid: "Qma51KJaSdehSWv7JZUzyib7U2pz6JttUNA2wTETn3dbCY",
    distributorMetadata: {
      name: "Email",
      description:
        "To distribute ERC20 tokens to a list of Email addresses that you have.",
    },
    type: "email",
    version: "",
    disabled: false,
  },
  {
    id: process.env.REACT_APP_CONTRACT_UUIDNFTDISTRIBUTOR ?? "",
    distributorCid: "QmbHWRsKbxVFQ8fC7JbS1E7fuax1tLAgVKs2VzrkpB1Tvj",
    distributorMetadata: {
      name: "Email",
      description:
        "To distribute NFT to a list of Email addresses that you have.",
    },
    type: "email-nft",
    version: "",
    disabled: false,
  },
].map((dist) => {
  return {
    ...dist,
    id: dist.id.toLowerCase(),
  };
});

export const getDistributorType = (type: string): string => {
  switch (type) {
    case "wallet":
      return "Wallet Address";
    case "uuid":
    case "email":
      return "URL/Email";
    default:
      return "";
  }
};

export default distributors;
