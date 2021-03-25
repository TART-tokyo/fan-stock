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
import NFTCampaignListTable, { NFTCampaignListTableProps } from "./index";
import { campaignsState } from "../../../utils/mockData";

export default {
  title: "Molecules/NFTCampaignListTable",
  component: NFTCampaignListTable,
} as Meta;

const Template: Story<NFTCampaignListTableProps> = (args) => (
  <BrowserRouter>
    <NFTCampaignListTable {...args} />
  </BrowserRouter>
);

export const Default = Template.bind({});
Default.args = {
  campaignsState: campaignsState,
  walletConnect: true,
};

export const NoCampaign = Template.bind({});
NoCampaign.args = {
  campaignsState: { campaigns: [] },
  walletConnect: true,
};

export const NoConnect = Template.bind({});
NoConnect.args = {
  campaignsState: { campaigns: [] },
  walletConnect: false,
};
