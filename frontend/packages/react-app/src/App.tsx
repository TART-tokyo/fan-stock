import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ExplorePage from "./components/pages/ExplorePage";
import DashboardPage from "./components/pages/DashboardPage";
import ExternalTokenDetailPage from "./components/pages/ExternalTokenDetailPage";
import SelectDistributorsPage from "./components/pages/SelectDistributorsPage";
import CreateCampaignPage from "./components/pages/CreateCampaignPage";
import CampaignDetailPage from "./components/pages/CampaignDetailPage";
import TokenCampaignsPage from "./components/pages/TokenCampaignsPage";
import TokenCampaignDetailPage from "./components/pages/TokenCampaignDetailPage";
import TokenHistoryPage from "./components/pages/TokenHistoryPage";
import TokenBasicInformationPage from "./components/pages/TokenBasicInformationPage";
import { TokenProvider } from "./components/context/token";
import { initialValue, tokenReducer } from "./reducers/tokenContext";

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <TokenProvider initialValue={initialValue} reducer={tokenReducer}>
          <div>
            <Route exact path="/" component={ExplorePage} />

            {/* For Creator */}
            <Route exact path="/dashboard" component={DashboardPage} />
            <Route
              exact
              path="/dashboard/:tokenAddress"
              component={ExternalTokenDetailPage}
            />
            <Route
              exact
              path="/dashboard/:tokenAddress/distributors"
              component={SelectDistributorsPage}
            />
            <Route
              exact
              path="/dashboard/:tokenAddress/distributors/:distributorAddress"
              component={CreateCampaignPage}
            />
            <Route
              exact
              path="/dashboard/:tokenAddress/distributors/:distributorAddress/campaigns/:campaignAddress"
              component={CampaignDetailPage}
            />

            {/* For Fan */}
            <Route exact path="/explore" component={ExplorePage} />
            <Route
              exact
              path="/explore/:tokenAddress"
              component={TokenBasicInformationPage}
            />
            <Route
              exact
              path="/explore/:tokenAddress/campaigns"
              component={TokenCampaignsPage}
            />
            <Route
              path="/explore/:tokenAddress/campaigns/:campaignAddress"
              component={TokenCampaignDetailPage}
            />
            <Route
              path="/explore/:tokenAddress/history"
              component={TokenHistoryPage}
            />
          </div>
        </TokenProvider>
      </Router>
    </div>
  );
};

export default App;
