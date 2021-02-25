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
import CreateUUIDCampaignStepper, { CreateUUIDCampaignStepperProps } from ".";
import { distributorFormState, tokenInfo } from "../../../utils/mockData";
import { uuidInitialState } from "../../../reducers/uuid";

export default {
  title: "Organisms/CreateUUIDCampaignStepper",
  component: CreateUUIDCampaignStepper,
} as Meta;

const Template: Story<CreateUUIDCampaignStepperProps> = (args) => (
  <BrowserRouter>
    <CreateUUIDCampaignStepper {...args} />
  </BrowserRouter>
);

export const StepOne = Template.bind({});
StepOne.args = {
  uuidState: uuidInitialState,
  tokenInfo,
  distributorFormState: {
    ...distributorFormState,
    step: 0,
  },
};
export const StepTwo = Template.bind({});
StepTwo.args = {
  uuidState: uuidInitialState,
  tokenInfo,
  distributorFormState: {
    ...distributorFormState,
    step: 1,
  },
};

export const StepThree = Template.bind({});
StepThree.args = {
  uuidState: uuidInitialState,
  tokenInfo,
  distributorFormState: {
    ...distributorFormState,
    step: 2,
  },
};
export const StepFour = Template.bind({});
StepFour.args = {
  uuidState: uuidInitialState,
  tokenInfo,
  distributorFormState: {
    ...distributorFormState,
    step: 3,
  },
};
export const StepFive = Template.bind({});
StepFive.args = {
  uuidState: uuidInitialState,
  tokenInfo,
  distributorFormState: {
    ...distributorFormState,
    step: 4,
  },
};
