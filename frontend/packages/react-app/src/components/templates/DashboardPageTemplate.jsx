import React from "react";
import { Heading, Loader } from "rimble-ui";
import AppHeader from "../molecules/AppHeader";
import CreatedTokenInfo from "../organisms/CreatedTokenInfo";

const DashboardPageTemplate = ({ provider, loadWeb3Modal, tokens, withdrawToken, restartStaking, stopStaking}) => (
  <div>
    <AppHeader provider={provider} loadWeb3Modal={loadWeb3Modal}/>
    <Heading as={"h2"}>Created Tokens</Heading>
    {tokens.length == 0 &&
      <Loader size="80px" m="auto" />
    }
    {tokens.map(token => 
      <CreatedTokenInfo
        key={token.address}
        token={token}
        withdrawToken={withdrawToken}
        restartStaking={restartStaking}
        stopStaking={stopStaking}
      />
    )}
  </div>
)

export default DashboardPageTemplate
