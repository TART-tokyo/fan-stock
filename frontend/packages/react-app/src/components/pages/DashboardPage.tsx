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

import React, { useCallback, useEffect, useReducer } from "react";
import Dashboard from "../templates/DashboardPageTemplate";
import { useWeb3React } from "@web3-react/core";
import {
  campaignsInitialState,
  campaignsReducer,
} from "../../reducers/campaigns";
import { useLazyQuery } from "@apollo/react-hooks";
import { GET_CAMPAIGNS_BY_CREATOR } from "../../graphql/subgraph";
import { getTokenInfo } from "../../utils/web3";
import { TokenOption } from "../atoms/SelectTokenInput";
import { useTokenContext } from "../../context/token";
import { TokenBasic } from "../../interfaces";

const DashboardPage: React.FC = () => {
  const { active, library, account } = useWeb3React();
  const { state: tokenState, dispatch: tokenDispatch } = useTokenContext();
  const [campaignsState, campaignDispatch] = useReducer(
    campaignsReducer,
    campaignsInitialState
  );
  const [getCampaignsByCreator, { data }] = useLazyQuery(
    GET_CAMPAIGNS_BY_CREATOR
  );

  const getCampaignMetadata = useCallback(async (campaigns) => {
    for (let i = 0; i < campaigns.length; i++) {
      const cid = campaigns[i].campaignInfoCid;
      const url = `https://cloudflare-ipfs.com/ipfs/${cid}`;
      const response = await fetch(url);
      campaigns[i].campaignMetadata = await response.json();
    }
    campaignDispatch({
      type: "campaignMetadata:set",
      payload: { data: campaigns },
    });
  }, []);

  useEffect(() => {
    if (account !== undefined && account !== null) {
      getCampaignsByCreator({
        variables: {
          creator: account.toLowerCase(),
        },
      });
    }
  }, [account, getCampaignsByCreator]);

  useEffect(() => {
    if (data !== undefined) {
      campaignDispatch({
        type: "campaign:get",
        payload: { data: data.campaigns },
      });
    }
  }, [data]);

  React.useEffect(() => {
    const f = async () => {
      const tokenBasicInfoList = campaignsState.campaigns
        .map((campaign) => campaign.token)
        .filter((elem, index, self) => self.indexOf(elem) === index) // distinct
        .map(async (token) => await getTokenInfo(library, token as string));
      return Promise.all(tokenBasicInfoList);
    };

    f().then((tokenBasicInfoList) => {
      tokenDispatch({
        type: "tokenBasicInfoList:set",
        payload: {
          tokenBasicInfoList: tokenBasicInfoList.filter(
            (token) => token !== undefined
          ) as TokenBasic[],
        },
      });
    });
  }, [campaignsState.campaigns]);

  useEffect(() => {
    if (campaignsState.campaigns.length > 0) {
      if (campaignsState.campaigns[0].campaignMetadata) {
        return;
      }
      getCampaignMetadata(campaignsState.campaigns);
    }
  }, [campaignsState, getCampaignMetadata]);

  // TODO: Remove mockData
  return (
    <Dashboard
      campaignsState={campaignsState}
      tokenState={tokenState}
      active={active}
    />
  );
};

export default DashboardPage;
