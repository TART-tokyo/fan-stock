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

export type UUID_ACTIONS =
  | {
      type: "quantity:set";
      payload: { quantity: string };
    }
  | {
      type: "targets:generate";
    }
  | {
      type: "moveToCampaignPage:on";
    };

export interface UUIDState {
  quantity: string;
  isValidQuantity: boolean;
  rawTargets: string[];
  targets: string[];
  type: "keccak256";
  moveToCampaignPage: boolean;
}

export const uuidReducer = (
  state: UUIDState,
  action: UUID_ACTIONS
): UUIDState => {
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
    default:
      throw new Error();
  }
};

export const uuidInitialState: UUIDState = {
  quantity: "",
  isValidQuantity: false,
  rawTargets: [],
  targets: [],
  type: "keccak256",
  moveToCampaignPage: false,
};
