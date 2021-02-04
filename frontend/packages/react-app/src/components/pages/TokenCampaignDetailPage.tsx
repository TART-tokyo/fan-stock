import { useLazyQuery } from "@apollo/react-hooks";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useReducer } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useTokenContext } from "../../context/token";
import { GET_CAMPAIGN, GET_CHECK_REQUEST } from "../../graphql/subgraph";
import { useGetAudiusUserOrSignIn } from "../../hooks/audius/useGetAudiusUser";
import { useIsClaimable } from "../../hooks/distributors/cct-wallet/useIsClaimable";
import { useGetAllowance } from "../../hooks/useGetAllowance";
import { CampaignInfo, CampaignMetadata } from "../../interfaces";
import { audiusInitialState, audiusReducer } from "../../reducers/audius";
import {
  campaignDetailReducer,
  initialState,
} from "../../reducers/campaignDetail";
import { LINK_TOKEN_ADDRESS } from "../../utils/const";
import { getTokenInfo, getWalletBalance } from "../../utils/web3";
import { TokenCampaignsDetailTemplate } from "../templates/TokenCampaignsDetailPageTemplate";
import distributors from "../../utils/distributors";
import { ethers } from "ethers";

const TokenCampaignDetailPage: React.FC<
  RouteComponentProps<{
    tokenAddress: string;
    campaignAddress: string;
    distributorAddress: string;
  }>
> = (props) => {
  const [state, dispatch] = useReducer(campaignDetailReducer, initialState);
  const [audiusState, audiusDispatch] = useReducer(
    audiusReducer,
    audiusInitialState
  );
  const [getCampaign, { data: campaignData }] = useLazyQuery(GET_CAMPAIGN);
  const { library } = useWeb3React();
  const { state: tokenState, dispatch: tokenStateDispatch } = useTokenContext();
  const tokenAddress = props.match.params.tokenAddress;
  const campaignAddress = props.match.params.campaignAddress;
  const distributorAddress = props.match.params.distributorAddress;

  const uuid: string =
    new URLSearchParams(props.location.search)?.get("uuid") ?? "";
  const hashedUUID: string = ethers.utils.solidityKeccak256(["string"], [uuid]);

  const [getCheckRequests, { data: checkRequestsData }] = useLazyQuery(
    GET_CHECK_REQUEST
  );
  const user = useGetAudiusUserOrSignIn(
    audiusState.libs,
    audiusState.email,
    audiusState.password,
    audiusState.requestSignin
  );
  const { isClaimable } = useIsClaimable(
    library,
    state?.campaignAddress ?? "",
    state?.distributorType,
    user?.wallet ?? "",
    hashedUUID
  );
  const { allowance } = useGetAllowance(
    library,
    LINK_TOKEN_ADDRESS,
    state?.campaignAddress ?? ""
  );

  useEffect(() => {
    dispatch({ type: "hashedUUID:set", payload: { hashedUUID } });
  }, [hashedUUID]);

  useEffect(() => {
    dispatch({ type: "campaignAddress:set", payload: { campaignAddress } });
  }, [campaignAddress]);

  useEffect(() => {
    if (
      tokenState.token === undefined ||
      tokenState.token.tokenAddress !== tokenAddress
    ) {
      const f = async () => {
        const token = await getTokenInfo(library, tokenAddress);
        if (token === undefined) {
          return;
        }
        tokenStateDispatch({ type: "token:set", payload: { token } });
      };
      f();
    }
  }, [library, tokenAddress]);
  useEffect(() => {
    if (
      tokenState.userAddress === "" ||
      tokenState.token?.tokenAddress !== tokenAddress
    ) {
      const f = async () => {
        if (library === undefined) {
          return;
        }
        const address = await library.getSigner().getAddress();
        tokenStateDispatch({
          type: "userAddress:set",
          payload: {
            address,
          },
        });
      };
      f();
    }
  }, [library, tokenStateDispatch]);
  useEffect(() => {
    if (
      tokenState.userBalance === "" ||
      tokenState.token?.tokenAddress !== tokenAddress
    ) {
      if (!library) {
        return;
      }
      const f = async () => {
        const balance = await getWalletBalance(library, tokenAddress);
        if (balance === undefined) {
          return;
        }
        tokenStateDispatch({ type: "userBalance:set", payload: { balance } });
      };
      f();
    }
  }, [library, tokenState.token, tokenStateDispatch]);

  useEffect(() => {
    getCampaign({
      variables: {
        id: campaignAddress.toLowerCase(),
      },
    });
  }, [campaignAddress, getCampaign]);

  useEffect(() => {
    console.debug(campaignData);
    const f = async () => {
      if (!tokenAddress) {
        return;
      }
      if (
        campaignData === undefined ||
        campaignData?.campaign?.campaignInfoCid === undefined
      ) {
        return;
      }
      const fetchCampaignMetaData: () => Promise<CampaignInfo> = async () => {
        const cid = campaignData.campaign.campaignInfoCid;
        const url = `https://cloudflare-ipfs.com/ipfs/${cid}`;
        const response = await fetch(url);
        const data = await response.json();
        const campaign: CampaignInfo = Object.assign<
          CampaignInfo,
          { campaignMetadata: CampaignMetadata }
        >(campaignData.campaign, { campaignMetadata: data });
        return campaign;
      };

      const fetchData = await fetchCampaignMetaData();
      dispatch({
        type: "campaign:set",
        payload: { campaign: fetchData },
      });
    };
    f();
  }, [tokenAddress, campaignData]);

  useEffect(() => {
    const distributor = distributors.find(
      (distributor) => distributor.id === distributorAddress
    );
    dispatch({
      type: "distributorType:set",
      payload: { distributorType: distributor?.type ?? "" },
    });
  }, [distributorAddress]);

  useEffect(() => {
    if (checkRequestsData === undefined) {
      return;
    }
    dispatch({
      type: "isTokenCheckFinished:set",
      payload: {
        checkRequests: checkRequestsData.checkRequests,
      },
    });
  }, [checkRequestsData]);

  useEffect(() => {
    dispatch({
      type: "isCampaignClaimable:set",
      payload: {
        isClaimable,
      },
    });
    if (isClaimable) {
      dispatch({
        type: "isCampaignClaimed:remove",
      });
    } else {
      dispatch({
        type: "isCampaignClaimed:setTrue",
      });
    }
  }, [isClaimable]);

  useEffect(() => {
    if (allowance === undefined) {
      return;
    }
    dispatch({
      type: "isTokenApproved:set",
      payload: { allowance: allowance },
    });
  }, [allowance]);

  return (
    <TokenCampaignsDetailTemplate
      state={state}
      tokenAddress={tokenAddress}
      dispatch={dispatch}
      audiusState={audiusState}
      audiusDispatch={audiusDispatch}
    />
  );
};

export default TokenCampaignDetailPage;
