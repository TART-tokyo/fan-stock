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
import CreateUUIDNFTCampaignPageTemplate, {
  CreateUUIDNFTCampaignPageTemplateProps,
} from "./index";
import { distributorFormState, tokenInfo } from "../../../utils/mockData";
import { uuidInitialState } from "../../../reducers/uuid";

export default {
  title: "Templates/CreateUUIDNFTCampaignPageTemplate",
  component: CreateUUIDNFTCampaignPageTemplate,
} as Meta;

const Template: Story<CreateUUIDNFTCampaignPageTemplateProps> = (args) => (
  <BrowserRouter>
    <CreateUUIDNFTCampaignPageTemplate {...args} />
  </BrowserRouter>
);

export const Step1 = Template.bind({});
Step1.args = {
  active: true,
  uuidState: {
    ...uuidInitialState,
    quantity: 100,
    isValidQuantity: true,
  },
  distributorFormState: {
    ...distributorFormState,
    distributorType: "uuid-nft",
    step: 0,
  },
};

export const Step2 = Template.bind({});
Step2.args = {
  ...Step1.args,
  distributorFormState: {
    ...distributorFormState,
    ...Step1.args.distributorFormState,
    step: 1,
  },
};

export const Step3 = Template.bind({});
Step3.args = {
  ...Step1.args,
  distributorFormState: {
    ...distributorFormState,
    ...Step1.args.distributorFormState,
    step: 2,
  },
};
