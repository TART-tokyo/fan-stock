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

import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { BrowserRouter } from "react-router-dom";
import {
  NFTCampaignsDetailTemplate,
  NFTCampaignsDetailTemplateProps,
} from "./index";
import { tokenInformationState } from "../../../utils/mockData";
import { TokenProvider } from "../../../context/token";
import { initialValue, tokenReducer } from "../../../reducers/tokenContext";
import { initialState } from "../../../reducers/campaignDetail";
import { ethers } from "ethers";

export default {
  title: "Templates/NFTCampaignsDetailTemplate",
  component: NFTCampaignsDetailTemplate,
} as Meta;

const Template: Story<NFTCampaignsDetailTemplateProps> = (args) => (
  <BrowserRouter>
    <TokenProvider
      initialValue={{
        ...initialValue,
        token: tokenInformationState.token,
        userAddress: tokenInformationState.userAddress,
        userBalance: tokenInformationState.userBalance,
      }}
      reducer={tokenReducer}
    >
      <NFTCampaignsDetailTemplate {...args} />
    </TokenProvider>
  </BrowserRouter>
);

export const Wallet = Template.bind({});
Wallet.args = {
  state: {
    ...initialState,
    distributorAddress: ethers.constants.AddressZero,
    campaign: tokenInformationState.campaigns[0],
    distributorType: "wallet-nft",
  },
};

export const UUID = Template.bind({});
UUID.args = {
  state: {
    ...initialState,
    distributorAddress: ethers.constants.AddressZero,
    campaign: tokenInformationState.campaigns[0],
    distributorType: "uuid-nft",
  },
};

export const OnlyView = Template.bind({});
OnlyView.args = {
  state: {
    ...initialState,
    distributorAddress: ethers.constants.AddressZero,
    campaign: tokenInformationState.campaigns[0],
    distributorType: "wallet-nft",
    isProofPresent: true,
  },
};
