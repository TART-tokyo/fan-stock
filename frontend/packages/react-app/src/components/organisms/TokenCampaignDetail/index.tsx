import * as React from "react";
import { TokenInformationState } from "../../../interfaces";
import { Card, CardContent, CardHeader, Typography } from "@material-ui/core";

export interface TokenCampaignDetailProps {
  readonly state: TokenInformationState;
  readonly campaignAddress: string;
}

const TokenCampaignDetail = ({
  state: { campaigns, campaignInformationList },
  campaignAddress,
}: TokenCampaignDetailProps) => {
  const campaign = campaigns.find(
    (campaign) => campaign.id === campaignAddress
  );
  const campaignInformation = campaignInformationList.find(
    (info) => info.address === campaignAddress
  );

  if (!campaign || !campaignInformation) {
    return (
      <div>
        <Typography>Campaign not found.</Typography>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader title={campaignInformation.name} />
        <CardContent>
          <Typography>Name: {campaignInformation.description}</Typography>
          <Typography>
            Start Date:{" "}
            {new Date(parseInt(campaign.startDate) * 1000).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenCampaignDetail;