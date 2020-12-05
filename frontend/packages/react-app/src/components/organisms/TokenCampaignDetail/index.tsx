import * as React from "react";
import { TokenInformationState } from "../../../interfaces";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import styled from "styled-components";
import CampaignStatusChip from "../../atoms/CampaignStatusChip";

export interface TokenCampaignDetailProps {
  readonly state: TokenInformationState;
  readonly campaignAddress: string;
}

// TODO Integrate styled-components theme
const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(3),
  },
}));

const RelativeContainer = styled.div`
  position: relative;
`;

const AbsoluteChip = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const TokenCampaignDetail = ({
  state: { campaigns },
  campaignAddress,
}: TokenCampaignDetailProps) => {
  const classes = useStyles();

  const campaign = campaigns.find(
    (campaign) => campaign.id === campaignAddress
  );

  if (!campaign) {
    return (
      <div>
        <Typography>Campaign not found.</Typography>
      </div>
    );
  }

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <RelativeContainer>
          <AbsoluteChip>
            <CampaignStatusChip status={campaign.status} />
          </AbsoluteChip>
          <Paper className={classes.container}>
            <Typography variant="h4" component="h2">
              {campaign.campaignMetadata.name}
            </Typography>
            <Typography>
              Name: {campaign.campaignMetadata.description}
            </Typography>
            <Typography>
              Start Date:{" "}
              {new Date(
                parseInt(campaign.startDate) * 1000
              ).toLocaleDateString()}
            </Typography>
          </Paper>
        </RelativeContainer>
      </Grid>
    </Grid>
  );
};

export default TokenCampaignDetail;
