import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ExplorePage from "./components/pages/ExplorePage";
import DashboardPage from "./components/pages/DashboardPage";
import TokenDetailPage from "./components/pages/TokenDetailPage";
import ExternalTokenDetailPage from "./components/pages/ExternalTokenDetailPage";
import SelectDistributersPage from "./components/pages/SelectDistributersPage";
import CreateCampaignPage from "./components/pages/CreateCampaignPage";
import CampaignDetailPage from "./components/pages/CampaignDetailPage";
import TokenCampaignsPage from "./components/pages/TokenCampaignsPage";
import TokenCampaignDetailPage from "./components/pages/TokenCampaignDetailPage";
import TokenHistoryPage from "./components/pages/TokenHistoryPage";

const App = () => {
  return (
    <div>
      <Router>
        <div>
          <Route exact path="/" component={ExplorePage} />

          {/* For Creator */}
          <Route exact path="/dashboard" component={DashboardPage} />
          <Route
            path="/dashboard/:tokenAddress"
            component={ExternalTokenDetailPage}
          />
          <Route
            path="/dashboard/:tokenAddress/distributers"
            component={SelectDistributersPage}
          />
          <Route
            exact
            path="/dashboard/:tokenAddress/distributers/:distributerAddress"
            component={CreateCampaignPage}
          />
          <Route
            path="/dashboard/:tokenAddress/distributers/:distributerAddress/campaigns/:campaignAddress"
            component={CampaignDetailPage}
          />

          {/* For Fan */}
          <Route exact path="/explore" component={ExplorePage} />
          <Route
            exact
            path="/explore/:tokenAddress"
            component={TokenDetailPage}
          />
          <Route
            path="/explore/:tokenAddress/basic"
            component={TokenDetailPage}
          />
          <Route
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
      </Router>
    </div>
  );
};

export default App;
