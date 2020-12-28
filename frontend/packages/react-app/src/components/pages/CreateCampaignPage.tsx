import React, { useEffect, useReducer, useCallback, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import CreateCampaignPageTemaplate from "../templates/CreateCampaignPageTemaplate";
import {
  getWalletBalance,
  getAllowance,
  setApproveAmount,
  createCampaign,
} from "../../utils/web3";
import { tokenReducer, tokenInitialState } from "../../reducers/token";
import {
  distributorFormReducer,
  distributorFormInitialState,
} from "../../reducers/distributorForm";
import { audiusReducer, audiusInitialState } from "../../reducers/audius";

import IpfsHttpClient from "ipfs-http-client";
import { useAudiusLibs } from "../../hooks/audius/useAudiusLibs";
import { useGetAudiusUserOrSignIn } from "../../hooks/audius/useGetAudiusUser";
import { useGetAudiusFollowers } from "../../hooks/audius/useGetAudiusFollowers";

declare global {
  interface Window {
    libs: any;
  }
}

const infura = { host: "ipfs.infura.io", port: 5001, protocol: "https" };
const ipfs = IpfsHttpClient(infura);

const CreateCampaignPage: React.FC<RouteComponentProps<{
  tokenAddress: string;
  distributorAddress: string;
}>> = (props) => {
  const { library, active } = useWeb3React();
  const tokenAddress = props.match.params.tokenAddress;
  const distributorAddress = props.match.params.distributorAddress;

  const [tokenState, tokenDispatch] = useReducer(
    tokenReducer,
    tokenInitialState
  );
  const [distributorFormState, distributorFormDispatch] = useReducer(
    distributorFormReducer,
    distributorFormInitialState
  );
  const [audiusState, audiusDispatch] = useReducer(
    audiusReducer,
    audiusInitialState
  );

  const { libs, isLibsInitialized } = useAudiusLibs();
  const user = useGetAudiusUserOrSignIn(
    libs,
    audiusState.email,
    audiusState.password,
    audiusState.requestSignin
  );
  const {
    followersCount,
    followers,
    progress,
    isLoading,
  } = useGetAudiusFollowers(libs, user);
  const [recipientsCid, setRecipientsCid] = useState("");
  const [campaignInfoCid, setCampaignInfoCid] = useState("");

  useEffect(() => {
    audiusDispatch({ type: "libs:set", payload: { libs } });
  }, [libs]);

  useEffect(() => {
    audiusDispatch({ type: "user:set", payload: { user } });
  }, [user]);

  useEffect(() => {
    audiusDispatch({ type: "followersCount:set", payload: { followersCount } });
    audiusDispatch({ type: "followers:set", payload: { followers } });
    audiusDispatch({ type: "progress:set", payload: { progress } });
  }, [followersCount, followers, progress]);

  const audiusSignOut = useCallback(async () => {
    await audiusState.libs.Account.logout();
    audiusDispatch({ type: "state:reset" });
  }, [audiusState.libs]);

  const getBalance = useCallback(
    async (library) => {
      const balance = await getWalletBalance(library, tokenAddress);
      if (balance === undefined) {
        return;
      }
      tokenDispatch({
        type: "token:setBalance",
        payload: { tokenBalance: balance },
      });
    },
    [tokenAddress]
  );

  const getAllowanceAmount = useCallback(
    async (library) => {
      const allowance = await getAllowance(
        library,
        tokenAddress,
        distributorAddress
      );
      if (allowance === undefined) {
        return;
      }
      tokenDispatch({
        type: "token:setAllowance",
        payload: { allowance: allowance },
      });
    },
    [tokenAddress, distributorAddress]
  );

  const approve = useCallback(
    async (library, approveAmount) => {
      setApproveAmount(
        library,
        tokenAddress,
        distributorAddress,
        approveAmount
      ).then((transaction) => {
        if (transaction === undefined) {
          return;
        }
        transaction.wait().then((result) => {
          if (result.status === 1) {
            tokenDispatch({
              type: "token:setAllowance",
              payload: { allowance: approveAmount },
            });
          }
        });
      });
      distributorFormDispatch({
        type: "approveAmount:set",
        payload: { approveAmount: "0" },
      });
    },
    [distributorAddress, tokenAddress]
  );

  const uploadJsonIpfs = useCallback(async (data, type) => {
    const { path } = await ipfs.add(JSON.stringify(data));
    if (type === "campaignInfoCid") {
      setCampaignInfoCid(path);
    }
    if (type === "recipientsCid") {
      setRecipientsCid(path);
    }
  }, []);

  const deployCampaign = useCallback(
    async (
      library,
      campaignInfoCid,
      recipientsCid,
      recipientsNum,
      startDate,
      endDate
    ) => {
      const secondsStartDate = startDate / 1000;
      const secondsEndDate = endDate / 1000;

      createCampaign(
        library,
        tokenAddress,
        campaignInfoCid,
        recipientsCid,
        recipientsNum,
        secondsStartDate,
        secondsEndDate
      ).then((transaction) => {
        if (transaction === undefined) {
          return;
        }
        transaction.wait().then((result) => {
          if (result.status === 1) {
            if (result.events && result.events[4].args) {
              const campaignAddress = result.events[4].args.campaign;
              props.history.push(
                window.location.pathname + `/campaigns/${campaignAddress}`
              );
            }
          }
        });
      });
    },
    [props.history, tokenAddress]
  );

  useEffect(() => {
    if (library) {
      getBalance(library);
      getAllowanceAmount(library);
    }
  }, [library, tokenAddress, getBalance, getAllowanceAmount]);

  useEffect(() => {
    tokenDispatch({
      type: "token:getLocal",
      payload: { tokenAddress: tokenAddress },
    });
  }, [tokenAddress]);

  useEffect(() => {
    if (distributorFormState.approveRequest && library) {
      approve(library, distributorFormState.approveAmount);
    }
    if (distributorFormState.requestDeployCampaign) {
      const campaignInfo = {
        description: "",
        image: "",
        name: distributorFormState.campaignName,
      };

      const followersAddress: string[] = audiusState.followers.map(
        (follower) => follower.wallet
      );
      const addresses = { addresses: followersAddress };
      uploadJsonIpfs(campaignInfo, "campaignInfoCid");
      uploadJsonIpfs(addresses, "recipientsCid");
    }
  }, [library, distributorFormState, approve, uploadJsonIpfs, audiusState]);

  useEffect(() => {
    if (
      campaignInfoCid === "" ||
      recipientsCid === "" ||
      audiusState.followersCount === 0 ||
      distributorFormState.startDate == null ||
      distributorFormState.endDate == null
    ) {
      return;
    }

    deployCampaign(
      library,
      campaignInfoCid,
      recipientsCid,
      audiusState.followersCount,
      distributorFormState.startDate,
      distributorFormState.endDate
    );
  }, [
    library,
    campaignInfoCid,
    recipientsCid,
    audiusState,
    distributorFormState,
    deployCampaign,
  ]);

  useEffect(() => {
    if (audiusState.isRequestSignout === true && audiusState.user) {
      audiusSignOut();
    }
  }, [audiusState.isRequestSignout, audiusState.user, audiusSignOut]);

  return (
    <>
      <CreateCampaignPageTemaplate
        active={active}
        tokenInfo={tokenState}
        distributorFormDispatch={distributorFormDispatch}
        distributorFormState={distributorFormState}
        audiusState={audiusState}
        audiusDispatch={audiusDispatch}
      />
    </>
  );
};

export default CreateCampaignPage;
