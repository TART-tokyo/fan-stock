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

import React, { useEffect, useReducer, useCallback, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import CreateWalletCampaignPageTemplate from "../templates/CreateWalletCampaignPageTemaplate";
import {
  getWalletBalance,
  getAllowance,
  setApproveAmount,
  createWalletCampaign,
  getTotalApproveAmount,
} from "../../utils/web3";
import { tokenReducer, tokenInitialState } from "../../reducers/token";
import {
  distributorFormReducer,
  distributorFormInitialState,
} from "../../reducers/distributorForm";
import { walletReducer, walletInitialState } from "../../reducers/wallet";
import {
  merkletreeReducer,
  merkltreeInitialState,
} from "../../reducers/merkletree";
import { WalletList } from "../../interfaces";

import IpfsHttpClient from "ipfs-http-client";
import useAxios from "axios-hooks";
import {
  IPFS_PINNING_API,
  MERKLE_ROOT_API_START,
  MERKLE_ROOT_API_DESCRIBE,
  MERKLE_ROOT_EXECUTION_ARN,
} from "../../utils/const";
import { BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils";

const infura = { host: "ipfs.infura.io", port: 5001, protocol: "https" };
const ipfs = IpfsHttpClient(infura);

interface CreateWalletCampaignPageProps {
  readonly props: RouteComponentProps;
  readonly distributorAddress: string;
}

const CreateWalletCampaignPage: React.FC<CreateWalletCampaignPageProps> = ({
  props,
  distributorAddress,
}) => {
  const { library, active, account } = useWeb3React();
  const [tokenState, tokenDispatch] = useReducer(
    tokenReducer,
    tokenInitialState
  );
  const [distributorFormState, distributorFormDispatch] = useReducer(
    distributorFormReducer,
    {
      ...distributorFormInitialState,
      distributorType: "wallet",
    }
  );
  const [walletListState, walletListDispatch] = useReducer(
    walletReducer,
    walletInitialState
  );
  const [merkletreeState, merkletreeDispatch] = useReducer(
    merkletreeReducer,
    merkltreeInitialState
  );
  const [recipientsCid, setRecipientsCid] = useState("");
  const [campaignInfoCid, setCampaignInfoCid] = useState("");
  const [{ error: pinningError }, postPinning] = useAxios(
    {
      url: IPFS_PINNING_API,
      method: "POST",
    },
    { manual: true }
  );

  const [{ error: proofError }, postMakeProof] = useAxios(
    {
      url: MERKLE_ROOT_API_START,
      method: "post",
    },
    { manual: true }
  );

  const [{ error: describeError }, describeMakeProof] = useAxios(
    {
      url: MERKLE_ROOT_API_DESCRIBE,
      method: "post",
    },
    { manual: true }
  );

  const getBalance = useCallback(
    async (library, tokenAddress) => {
      const balance = await getWalletBalance(library, tokenAddress);
      if (balance === undefined) {
        return;
      }
      tokenDispatch({
        type: "token:setBalance",
        payload: { tokenBalance: balance },
      });
    },
    [tokenDispatch]
  );

  const getAllowanceAmount = useCallback(
    async (library, tokenAddress) => {
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
    [distributorAddress, tokenDispatch]
  );

  const approve = useCallback(
    async (library, approveAmount, decimals, recipients: number) => {
      setApproveAmount(
        library,
        distributorFormState.tokenAddress,
        distributorAddress,
        approveAmount,
        decimals,
        recipients
      )
        .then(async (transaction) => {
          if (transaction === undefined) {
            return;
          }
          await transaction.wait().then((result) => {
            if (result.status === 1) {
              tokenDispatch({
                type: "token:setAllowance",
                payload: {
                  allowance:
                    getTotalApproveAmount(
                      approveAmount,
                      recipients,
                      decimals
                    ) ?? "",
                },
              });
            }
          });
        })
        .catch((error) => {
          console.error(error);
          alert(
            "There was an error or you rejected transaction. Please try again later."
          );
        })
        .finally(() => {
          distributorFormDispatch({
            type: "dialog:set",
            payload: { dialog: "nothing" },
          });
        });
      distributorFormDispatch({
        type: "approveAmount:set",
        payload: { approveAmount: "0" },
      });
    },
    [distributorAddress, distributorFormState.tokenAddress]
  );

  const uploadJsonIpfs = useCallback(
    async (data, type) => {
      const { path } = await ipfs.add(JSON.stringify(data));
      await postPinning({ data: { hashToPin: path } });
      if (type === "campaignInfoCid") {
        setCampaignInfoCid(path);
      }
      if (type === "recipientsCid") {
        setRecipientsCid(path);
      }
    },
    [postPinning]
  );

  const deployCampaign = useCallback(
    async (library, merkleRoot, campaignInfoCid, merkleTreeCid) => {
      distributorFormDispatch({
        type: "campaign:deploy",
        payload: { requestDeployCampaign: false },
      });
      distributorFormDispatch({
        type: "dialog:set",
        payload: { dialog: "creating-campaign" },
      });

      createWalletCampaign(
        library,
        merkleRoot,
        distributorFormState.tokenAddress,
        campaignInfoCid,
        merkleTreeCid,
        tokenState.allowance
      )
        .then(async (transaction) => {
          if (transaction === undefined) {
            return;
          }
          await transaction.wait().then((result) => {
            if (result.status !== 1) {
              return;
            }
            if (result.events == undefined) {
              return;
            }
            const campaignCreatedEvent = result.events.find(
              (event) =>
                event.event === "CreateCampaign" &&
                event.address.toLowerCase() === distributorAddress.toLowerCase()
            );
            if (campaignCreatedEvent === undefined) {
              return;
            }
            const distributionId: BigNumber =
              campaignCreatedEvent.args?.distributionId;
            props.history.push(
              `/dashboard/${distributorFormState.tokenAddress}/distributors/${distributorAddress}` +
                `/campaigns/${distributionId.toString()}`
            );
          });
        })
        .catch((error) => {
          console.error(error);
          alert(
            "There was an error or you rejected transaction. Please try again later."
          );
        })
        .finally(() => {
          distributorFormDispatch({
            type: "dialog:set",
            payload: { dialog: "nothing" },
          });
        });
    },
    [
      props.history,
      distributorFormState.tokenAddress,
      distributorAddress,
      tokenState.allowance,
    ]
  );

  const makeMerkleProof = useCallback(
    async (allowance, targetNum, recipientsCid, account) => {
      const BNAllowance = BigNumber.from(allowance);
      const BNTargetsNum = BigNumber.from(targetNum);
      const amount = BNAllowance.div(BNTargetsNum).toString();

      /*eslint-disable no-useless-escape*/
      const data = JSON.stringify({
        input: `{\"cid\": \"${recipientsCid}\",\"amount\": ${amount}}`,
        name: `${account}-${Date.now()}`,
        stateMachineArn: MERKLE_ROOT_EXECUTION_ARN,
      });
      const response = await postMakeProof({ data: data });
      merkletreeDispatch({
        type: "startExecution:result",
        payload: { executionArn: response.data.executionArn },
      });
    },
    []
  );

  const describeMerkleProof = useCallback(async (executionArn) => {
    const data = JSON.stringify({
      executionArn: executionArn,
    });
    const response = await describeMakeProof({ data: data });
    if (response.data.status === "RUNNING") {
      console.log("RUNNING");
      merkletreeDispatch({
        type: "describeStatus:update",
        payload: { status: response.data.status },
      });
    }
    if (response.data.status === "FAILED") {
      console.log("FAILED");
      merkletreeDispatch({
        type: "describeStatus:update",
        payload: { status: response.data.status },
      });
      alert(
        "There was an error or you rejected transaction. Please try again later."
      );
      distributorFormDispatch({
        type: "dialog:set",
        payload: { dialog: "nothing" },
      });
    }
    if (response.data.status === "SUCCEEDED") {
      console.log("SUCCEEDED");
      const data = JSON.parse(response.data.output);
      merkletreeDispatch({
        type: "merkleroot:set",
        payload: { merkleRoot: data.merkleRoot, merkleTreeCid: data.cid },
      });
    }
  }, []);

  useEffect(() => {
    if (
      distributorFormState.tokenAddress === "" ||
      !isAddress(distributorFormState.tokenAddress)
    ) {
      return;
    }
    if (library) {
      getBalance(library, distributorFormState.tokenAddress);
      getAllowanceAmount(library, distributorFormState.tokenAddress);
    }
  }, [
    library,
    getBalance,
    getAllowanceAmount,
    distributorFormState.tokenAddress,
  ]);

  useEffect(() => {
    const f = async () => {
      if (distributorFormState.approveRequest && library) {
        approve(
          library,
          distributorFormState.approveAmount,
          tokenState.token?.decimals,
          walletListState.targets.length
        );
      }

      if (distributorFormState.requestDeployCampaign) {
        const campaignInfo = {
          description: distributorFormState.campaignDescription,
          image: "",
          name: distributorFormState.campaignName,
        };

        const addresses = {
          targets: walletListState.targets,
          type: walletListState.type,
        };

        await uploadJsonIpfs(campaignInfo, "campaignInfoCid");
        await uploadJsonIpfs(addresses, "recipientsCid");
      }
    };
    f();
  }, [library, distributorFormState]);

  useEffect(() => {
    if (!distributorFormState.requestDeployCampaign) {
      return;
    }

    if (pinningError) {
      console.error(pinningError);
      alert(
        "There is an error on uploading a file used for campaign. Please try again later."
      );
      return;
    }

    if (
      campaignInfoCid === "" ||
      recipientsCid === "" ||
      walletListState.targets.length === 0 ||
      tokenState.allowance === ""
    ) {
      return;
    }

    makeMerkleProof(
      tokenState.allowance,
      walletListState.targets.length,
      recipientsCid,
      account
    );
  }, [distributorFormState, campaignInfoCid, recipientsCid]);

  useEffect(() => {
    const f = async () => {
      const _sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      if (
        merkletreeState.executionArn === "" ||
        merkletreeState.status === "FAILED"
      ) {
        return;
      }
      if (
        merkletreeState.status === "" ||
        merkletreeState.status === "RUNNING"
      ) {
        await _sleep(5000);
        describeMerkleProof(merkletreeState.executionArn);
        return;
      }
      if (merkletreeState.status === "SUCCEEDED") {
        deployCampaign(
          library,
          merkletreeState.merkleRoot,
          campaignInfoCid,
          merkletreeState.merkleTreeCid
        );
        return;
      }
    };
    f();
  }, [merkletreeState]);

  useEffect(() => {
    if (walletListState.filelist === null) {
      return;
    }
    const file = walletListState.filelist[0];
    const reader = new FileReader();
    let walletList: WalletList;
    reader.onloadend = () => {
      if (reader.result?.toString() === undefined) {
        return;
      }
      walletList = JSON.parse(reader.result?.toString());
      if (Object.keys(walletList).indexOf("targets") === -1) {
        walletListDispatch({
          type: "fileformat:set",
          payload: { status: false },
        });
        return;
      }
      if (!Array.isArray(walletList.targets)) {
        walletListDispatch({
          type: "fileformat:set",
          payload: { status: false },
        });
        return;
      }

      walletListDispatch({
        type: "walletlist:set",
        payload: { targets: walletList.targets },
      });
    };
    reader.readAsText(file);
  }, [walletListState]);

  return (
    <>
      <CreateWalletCampaignPageTemplate
        active={active}
        tokenInfo={tokenState}
        tokenDispatch={tokenDispatch}
        distributorFormDispatch={distributorFormDispatch}
        distributorFormState={distributorFormState}
        walletDispatch={walletListDispatch}
        walletListState={walletListState}
      />
    </>
  );
};

export default CreateWalletCampaignPage;
