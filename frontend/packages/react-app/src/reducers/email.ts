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

import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";

export type EMAIL_ACTIONS =
  | {
      type: "emailListFile:upload";
      payload: { walletlistFile: FileList | null };
    }
  | {
      type: "emailList:set";
      payload: { email: string[] };
    }
  | { type: "fileformat:set"; payload: { status: boolean } }
  | {
      type: "quantity:set";
      payload: { quantity: string };
    }
  | {
      type: "targets:generate";
    }
  | {
      type: "moveToCampaignPage:on";
    }
  | {
      type: "distributorAddress:set";
      payload: {
        distributorAddress: string;
      };
    };

export interface EmailState {
  quantity: string;
  isValidQuantity: boolean;
  rawTargets: string[];
  targets: string[];
  emailList: string[];
  type: "keccak256";
  moveToCampaignPage: boolean;
  distributorAddress: string;
  filelist: FileList | null;
  fileformat: boolean;
}

export const emailReducer = (
  state: EmailState,
  action: EMAIL_ACTIONS
): EmailState => {
  switch (action.type) {
    case "quantity:set": {
      const parsed = Number.parseInt(action.payload.quantity);
      const quantity = isNaN(parsed) ? 0 : parsed;
      return {
        ...state,
        quantity: action.payload.quantity,
        isValidQuantity: quantity > 0,
      };
    }
    case "targets:generate": {
      const quantity = Number.parseInt(state.quantity);
      const rawTargets: string[] = [...Array(quantity)].map(() => uuidv4());
      const targets: string[] = rawTargets.map((uuid) =>
        ethers.utils.solidityKeccak256(["string"], [uuid])
      );
      return {
        ...state,
        rawTargets,
        targets,
      };
    }
    case "moveToCampaignPage:on": {
      return {
        ...state,
        moveToCampaignPage: true,
      };
    }
    case "distributorAddress:set": {
      return {
        ...state,
        distributorAddress: action.payload.distributorAddress,
      };
    }
    default:
      throw new Error();
  }
};

export const emailInitialState: EmailState = {
  quantity: "",
  isValidQuantity: false,
  rawTargets: [],
  targets: [],
  emailList: [],
  type: "keccak256",
  moveToCampaignPage: false,
  distributorAddress: "",
  filelist: null,
  fileformat: true,
};
