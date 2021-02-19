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

import Typography from "@material-ui/core/Typography";
import React from "react";
import styled from "styled-components";
import { useTokenContext } from "../../../context/token";
import theme from "../../../theme/mui-theme";
import { getBalanceDevidedByDecimals } from "../../../utils/web3";
import EtherscanLink from "../../atoms/EtherscanLink";

const TokenInfoBar = () => {
  const { state } = useTokenContext();
  const loading = !state.token;
  return (
    <InfoBar>
      <div>
        <div>
          <Typography variant="h3" gutterBottom>
            {state.token?.name ?? "..."}
            <span
              style={{
                display: "inline-block",
                marginLeft: 8,
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8.5" cy="8.5" r="8.5" fill="#D06689" />
                <path
                  d="M4.88026 7.25H12.1168C12.6174 7.25 12.8678 7.83789 12.5134 8.18242L8.89651 11.7016C8.67714 11.9148 8.31995 11.9148 8.10057 11.7016L4.4837 8.18242C4.12932 7.83789 4.37964 7.25 4.88026 7.25Z"
                  fill="white"
                />
              </svg>
            </span>
          </Typography>
        </div>
        <div>
          <Typography variant="caption">Symbol:</Typography>
          <Item>{loading ? "..." : state.token?.symbol}</Item>
          <Typography variant="caption">Total Supply:</Typography>
          <Item>
            {loading
              ? "..."
              : getBalanceDevidedByDecimals(
                  state.token?.totalSupply ?? "0",
                  state.token?.decimals ?? 0
                )}
          </Item>
          <Typography variant="caption">Decimals:</Typography>
          <Item>{loading ? "..." : state.token?.decimals}</Item>
          <ScanLinkWrapper>
            {!!state.token && (
              <EtherscanLink
                type="token"
                address={state.token.tokenAddress}
                small
              />
            )}
          </ScanLinkWrapper>
        </div>
      </div>
      {!!state.userBalance && (
        <BalanceWrapper>
          <Typography variant="caption">Your Balance</Typography>
          <Typography variant="h3">
            {state
              ? getBalanceDevidedByDecimals(
                  state.userBalance,
                  state.token?.decimals ?? 0
                )
              : "-"}
            {!!state.token?.symbol && " $" + state.token.symbol}
          </Typography>
          <UserScanLinkWrapper>
            {!!state.userAddress && (
              <EtherscanLink type="token" address={state.userAddress} small />
            )}
          </UserScanLinkWrapper>
        </BalanceWrapper>
      )}
    </InfoBar>
  );
};

const ScanLinkWrapper = styled.div`
  & > p {
    text-align: left;
    ${theme.breakpoints.down(600)} {
      text-align: center;
    }
  }
`;
const UserScanLinkWrapper = styled.div`
  & > p {
    text-align: right;
    ${theme.breakpoints.down(600)} {
      text-align: center;
    }
  }
`;
const BalanceWrapper = styled.div`
  width: 30%;
  border-left: 1px solid #000;
  padding-left: 18px;
  ${theme.breakpoints.down(600)} {
    width: 100%;
    border: none;
    border-top: 1px solid #000;
    margin-top: 24px;
    padding-top: 16px;
    padding-left: 0;
  }
`;

const InfoBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 38px;
  ${theme.breakpoints.down(600)} {
    display: block;
  }
`;

const Item = styled.span`
  padding: 0 4px;
`;

export default TokenInfoBar;
