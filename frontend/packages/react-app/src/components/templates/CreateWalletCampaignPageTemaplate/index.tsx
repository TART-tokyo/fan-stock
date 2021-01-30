import React from "react";
import { Box, Typography, Container } from "@material-ui/core";
import AppHeader from "../../molecules/AppHeader";
import ApproveToken from "../../organisms/ApproveToken";
import SetupCampaign from "../../organisms/SetupCampaign";
import { AccountToken } from "../../../interfaces";
import WalletDistributionTargets from "../../organisms/WalletDistributionTargets";
import WalletConnect from "../../organisms/WalletConnect";
import {
  createCampaignState,
  DISTRIBUTOR_ACTIONS,
} from "../../../reducers/distributorForm";
import { WALLET_ACTIONS } from "../../../reducers/wallet";
import { WalletList } from "../../../interfaces";
import { AppFooter } from "../../molecules/AppFooter";

export interface CampaignInfo {
  readonly active: boolean;
  readonly tokenInfo: AccountToken;
  readonly distributorFormState: createCampaignState;
  readonly distributorFormDispatch: React.Dispatch<DISTRIBUTOR_ACTIONS>;
  readonly walletListState: WalletList;
  readonly walletDispatch: React.Dispatch<WALLET_ACTIONS>;
}

const CreateWalletCampaignPageTemplate: React.FC<CampaignInfo> = ({
  active,
  tokenInfo,
  distributorFormState,
  distributorFormDispatch,
  walletListState,
  walletDispatch,
}) => (
  <div style={{ height: "100vh" }}>
    <AppHeader />
    <Box
      mt={5}
      style={{
        boxSizing: "border-box",
        height: "calc(100% - 266px)",
        minHeight: "300px",
      }}
    >
      <Container>
        {!active ? (
          <Box>
            <WalletConnect />
          </Box>
        ) : (
          <Box>
            <Box my={1}>
              <Typography variant={"h3"}>Wallet Address Campaign</Typography>
            </Box>
            {distributorFormState.step === 1 && (
              <WalletDistributionTargets
                walletListState={walletListState}
                distributorFormDispatch={distributorFormDispatch}
                walletDispatch={walletDispatch}
              />
            )}
            {distributorFormState.step === 2 && (
              <ApproveToken
                tokenInfo={tokenInfo}
                distributorFormState={distributorFormState}
                distributorFormDispatch={distributorFormDispatch}
              />
            )}
            {distributorFormState.step === 3 && (
              <SetupCampaign
                distributorFormState={distributorFormState}
                distributorFormDispatch={distributorFormDispatch}
              />
            )}
          </Box>
        )}
      </Container>
    </Box>
    <AppFooter />
  </div>
);

export default CreateWalletCampaignPageTemplate;