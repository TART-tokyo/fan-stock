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
import { TokenCampaignsState } from "../../../reducers/tokenCampaigns";
import AppFrame from "../../organisms/AppFrame";
import NFTCampaigns from "../../organisms/NFTCampaigns";
import { NFTTabMenuForFunPage } from "../../molecules/NFTTabMenuForFunPage";

export interface NFTCampaignsTemplateProps {
  state: TokenCampaignsState;
}

export const NFTCampaignsTemplate: React.FC<NFTCampaignsTemplateProps> = ({
  state,
}) => {
  return (
    <>
      <AppFrame>
        <NFTTabMenuForFunPage current={"campaigns"} />
        <NFTCampaigns campaigns={state.campaigns} currentTab="campaigns" />
      </AppFrame>
    </>
  );
};
