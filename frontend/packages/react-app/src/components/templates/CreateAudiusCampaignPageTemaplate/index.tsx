import React from "react";
import { Box, Typography, Container } from "@material-ui/core";
import AppHeader from "../../molecules/AppHeader";
import ApproveToken from "../../organisms/ApproveToken";
import SetupCampaign from "../../organisms/SetupCampaign";
import { AccountToken } from "../../../interfaces";
import DistributionTargets from "../../organisms/AudiusDistributionTargets";
import WalletConnect from "../../organisms/WalletConnect";
import {
  createCampaignState,
  DISTRIBUTOR_ACTIONS,
} from "../../../reducers/distributorForm";
import { AudiusState, AUDIUS_ACTIONS } from "../../../reducers/audius";
import { AppFooter } from "../../molecules/AppFooter";

export interface CampaignInfo {
  readonly active: boolean;
  readonly tokenInfo: AccountToken;
  readonly distributorFormState: createCampaignState;
  distributorFormDispatch: React.Dispatch<DISTRIBUTOR_ACTIONS>;
  readonly audiusState: AudiusState;
  readonly audiusDispatch: React.Dispatch<AUDIUS_ACTIONS>;
}

const CreateAudiusCampaignPageTemaplate: React.FC<CampaignInfo> = ({
  active,
  tokenInfo,
  distributorFormState,
  distributorFormDispatch,
  audiusState,
  audiusDispatch,
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
              <Typography variant={"h3"}>Audius Follower Campaign</Typography>
            </Box>
            {distributorFormState.step === 1 && (
              <DistributionTargets
                audiusState={audiusState}
                audiusDispatch={audiusDispatch}
                distributorFormDispatch={distributorFormDispatch}
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

export default CreateAudiusCampaignPageTemaplate;