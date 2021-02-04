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

import React, { useEffect, useReducer } from "react";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router-dom";
import { useGetTransferEvents } from "../../hooks/useGetTransferEvents";
import { tokenHistoryReducer, initialState } from "../../reducers/tokenHistory";
import { getTokenInfo, getWalletBalance } from "../../utils/web3";
import { Block } from "@ethersproject/providers";
import { Event } from "@ethersproject/contracts";
import { useTokenContext } from "../../context/token";
import { TokenHistoryTemplate } from "../templates/TokenHistoryPageTemplate";
interface Params {
  tokenAddress: string;
}
const TokenHistoryPage: React.FC = () => {
  const { library } = useWeb3React();
  const [state, dispatch] = useReducer(tokenHistoryReducer, initialState);
  const { state: tokenState, dispatch: tokenStateDispatch } = useTokenContext();
  const { tokenAddress } = useParams<Params>();
  const { result: allTransferEvents } = useGetTransferEvents(
    library,
    tokenAddress
  );

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
    const f = async () => {
      if (allTransferEvents === undefined || state.userAddress === undefined) {
        return;
      }
      const eventBlockPairs: {
        event: Event;
        block: Block;
      }[] = await Promise.all(
        allTransferEvents.map(async (event) => {
          const block = await event.getBlock();
          return { event, block };
        })
      );
      dispatch({
        type: "activities:setTransfers",
        payload: {
          eventBlockPairs,
        },
      });
      dispatch({
        type: "balances:set",
        payload: {
          walletAddress: state.userAddress,
          eventBlockPairs,
        },
      });
    };
    f();
  }, [allTransferEvents, state.userAddress]);

  return <TokenHistoryTemplate state={state} tokenAddress={tokenAddress} />;
};

export default TokenHistoryPage;
