import * as React from "react";
import { TokenInformationState } from "../../../interfaces";
import TokenRequestCard from "../../molecules/TokenRequestCard";
import AudiusTokenClaimCard from "../../molecules/AudiusTokenClaimCard";
import TokenCampaignDetail from "../TokenCampaignDetail";
import { Typography, Box } from "@material-ui/core";
import { Dispatch } from "react";
import { TokenInformationAction } from "../../../reducers/tokenInformation";
import SigninAudius from "../../molecules/SigninAudius";
import { AUDIUS_ACTIONS, AudiusState } from "../../../reducers/audius";

export interface AudiusCampaignDetailPanelProps {
  readonly state: TokenInformationState;
  readonly dispatch: Dispatch<TokenInformationAction>;
  readonly audiusState: AudiusState;
  readonly audiusDispatch: Dispatch<AUDIUS_ACTIONS>;
}

// TODO: Add waiting transactions
const AudiusCampaignDetailPanel: React.FC<AudiusCampaignDetailPanelProps> = ({
  state,
  dispatch,
  audiusState,
  audiusDispatch,
}) => {
  const campaign = state.campaigns.find(
    (campaign) => campaign.id === state.campaignAddress
  );
  if (!state.token || !campaign) {
    return (
      <div>
        <Typography>Campaign not found.</Typography>
      </div>
    );
  }

  const startDate = Number.parseInt(campaign.startDate);
  const endDate = Number.parseInt(campaign.endDate);
  const now = state.now.getTime() / 1000;
  if (now < startDate || endDate <= now) {
    return (
      <div style={{ marginTop: "24px" }}>
        <TokenCampaignDetail campaign={campaign} />
      </div>
    );
  }

  return (
    <div style={{ marginTop: "24px" }}>
      <TokenCampaignDetail campaign={campaign} />
      <Box mt={2}>
        {!audiusState.user ? (
          <SigninAudius
            audiusState={audiusState}
            audiusDispatch={audiusDispatch}
          />
        ) : (
          <>
            <TokenRequestCard
              state={state}
              dispatch={dispatch}
              audiusState={audiusState}
            />
            {state.isTokenCheckFinished && (
              <AudiusTokenClaimCard
                campaignAddress={state?.campaignAddress ?? ""}
                symbol={state.token.symbol}
                decimals={state.token.decimals}
                claimAmount={campaign.claimAmount}
                isClaimable={state.isCampaignClaimable}
                isClaimed={state.isCampaignClaimed}
                userAddress={state.userAddress ?? ""}
                dispatch={dispatch}
                audiusState={audiusState}
                distributorType={state.distributorType}
              />
            )}
          </>
        )}
      </Box>
    </div>
  );
};

export default AudiusCampaignDetailPanel;
