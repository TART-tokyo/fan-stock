import * as React from "react";
import { TokenInformationState } from "../../../interfaces";
import TokenRequestCard from "../../molecules/TokenRequestCard";
import TokenClaimCard from "../../molecules/TokenClaimCard";
import TokenCampaignDetail from "../TokenCampaignDetail";
import { Typography } from "@material-ui/core";
import { Dispatch } from "react";
import { TokenInformationAction } from "../../../reducers/tokenInformation";
import SigninAudius from "../../molecules/SigninAudius";
import { AUDIUS_ACTIONS, AudiusState } from "../../../reducers/audius";

export interface TokenDetailCampaignPanelProps {
  readonly state: TokenInformationState;
  readonly dispatch: Dispatch<TokenInformationAction>;
  readonly audiusState: AudiusState;
  readonly audiusDispatch: Dispatch<AUDIUS_ACTIONS>;
}

// TODO: Add waiting transactions
const TokenDetailCampaignPanel: React.FC<TokenDetailCampaignPanelProps> = ({
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
            audiusDispatch={audiusDispatch}
          />
          {state.isTokenCheckFinished && (
            <TokenClaimCard
              campaignAddress={state?.campaignAddress ?? ""}
              symbol={state.token.symbol}
              decimals={state.token.decimals}
              claimAmount={campaign.claimAmount}
              isClaimable={state.isCampaignClaimable}
              isClaimed={state.isCampaignClaimed}
              userAddress={state.userAddress ?? ""}
              audiusState={audiusState}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TokenDetailCampaignPanel;
