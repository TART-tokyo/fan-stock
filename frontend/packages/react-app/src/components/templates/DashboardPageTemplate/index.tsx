import React from "react";
import { Box, Typography } from "@material-ui/core";
import AppHeader from "../../molecules/AppHeader";
import { ACTIONS } from "../../../reducers/tokens";
import { TokenListState } from "../../../interfaces";
import TokenList from "../../organisms/TokenList";
import SetTokenModal from "../../organisms/SetTokenModal";
import AddNewToken from "../../atoms/AddNewToken";
import { AppFooter } from "../../molecules/AppFooter";

export interface DashboardPageTemplateProps {
  readonly state: TokenListState;
  dispatch: React.Dispatch<ACTIONS>;
}

const DashboardPageTemplate: React.FC<DashboardPageTemplateProps> = ({
  state,
  dispatch,
}) => (
  <div style={{ height: "100vh" }}>
    <AppHeader />
    <Box
      m={"auto"}
      my={5}
      p={2}
      width={[4 / 5, 1 / 2]}
      minWidth={320}
      style={{
        boxSizing: "border-box",
        height: "calc(100% - 266px)",
        minHeight: "300px",
      }}
    >
      <Typography variant={"h3"}>Token Distribution Dashboard</Typography>
      <Box mt={2}>
        <Typography>
          You can create a token distribution campaign. Let&apos;s set the
          tokens to be distributed and create a campaign.
        </Typography>
      </Box>
      <TokenList state={state} />
      <AddNewToken color={state.color} dispatch={dispatch} />
      <SetTokenModal state={state} dispatch={dispatch} />
    </Box>
    <AppFooter />
  </div>
);

export default DashboardPageTemplate;
