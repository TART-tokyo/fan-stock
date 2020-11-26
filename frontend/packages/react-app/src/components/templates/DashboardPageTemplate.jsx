import React from "react";
import { Heading, Loader, Box } from "rimble-ui";
import Index from "../molecules/AppHeader";
import CreatedTokenInfo from "../organisms/CreatedTokenInfo";

const DashboardPageTemplate = ({
  tokens,
  withdrawToken,
  restartStaking,
  stopStaking,
}) => (
  <div>
    <Index />
    <Box m={"auto"} my={5} width={[3 / 4, 1 / 2]}>
      <Heading as={"h2"}>Created Tokens</Heading>
      {tokens.length == 0 && <Loader size="80px" m="auto" mt={5} />}
      {tokens.map((token) => (
        <CreatedTokenInfo
          key={token.address}
          token={token}
          withdrawToken={withdrawToken}
          restartStaking={restartStaking}
          stopStaking={stopStaking}
        />
      ))}
    </Box>
  </div>
);

export default DashboardPageTemplate;
