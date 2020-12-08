import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { BrowserRouter } from "react-router-dom";
import CampaignListTable from "./index";
import {
  TokenAndCampaignProps,
  TokenInfo,
  CampaignInfo,
} from "../../../interfaces";

export default {
  title: "Molecules/CampaignListTable",
  component: CampaignListTable,
} as Meta;

const Template: Story<TokenAndCampaignProps> = (args) => (
  <BrowserRouter>
    <CampaignListTable {...args} />
  </BrowserRouter>
);

const tokenState: TokenInfo = {
  token: {
    name: "TestUsdtToken",
    tokenAddress: "0xD92E713d051C37EbB2561803a3b5FBAbc4962431",
  },
};

const campaignsState: CampaignInfo[] = [
  {
    id: "0xcc22b3199013627708d05fedf9b854bd7706a156",
    distributor: {
      id: "0x48889feca4574810e5a5b30b6b93146a837500fb",
      distributorCid: "Qmf8C4mjVGgzxVzWcAevxCHZiCCUG38rxeDC7Byt5tsVoA",
      distributorMetadata: {
        name: "Audius Followers Distributor",
        description:
          "This distributer enables creators to distributes tokens for their followers on Auduis.",
        image: "https://example.com/distributerimage.jpg",
      },
    },
    token: "",
    startDate: "20201212",
    endDate: "20201212",
    creator: {
      id: "",
    },
    status: 0,
    campaignInfoCid: "QmYdUkdEgQtn4viySEQie51JAwrC3xTyDqDbdWXWEwAz5J",
    recipientsCid: "",
    claimAmount: "0",
    claimedNum: 0,
    claims: [],
    checkRequests: [],
    campaignMetadata: {
      name: "Audiusフォロワーさん向けトークン配布キャンペーン！",
      description:
        "Audiusアカウントのフォロワーの方へトークンを配布します。手順はXXX...",
      image: "https://example.com/campaignimage.jpg",
    },
  },
  {
    id: "0xcc22b3199013627708d05fedf9b854bd7706a156",
    distributor: {
      id: "0x48889feca4574810e5a5b30b6b93146a837500fb",
      distributorCid: "Qmf8C4mjVGgzxVzWcAevxCHZiCCUG38rxeDC7Byt5tsVoA",
      distributorMetadata: {
        name: "Audius Followers Distributor",
        description:
          "This distributer enables creators to distributes tokens for their followers on Auduis.",
        image: "https://example.com/distributerimage.jpg",
      },
    },
    token: "",
    startDate: "20201212",
    endDate: "20201212",
    creator: {
      id: "",
    },
    status: 0,
    campaignInfoCid: "QmYdUkdEgQtn4viySEQie51JAwrC3xTyDqDbdWXWEwAz5J",
    recipientsCid: "",
    claimAmount: "0",
    claimedNum: 0,
    claims: [],
    checkRequests: [],
    campaignMetadata: {
      name: "Audiusフォロワーさん向けトークン配布キャンペーン！",
      description:
        "Audiusアカウントのフォロワーの方へトークンを配布します。手順はXXX...",
      image: "https://example.com/campaignimage.jpg",
    },
  },
  {
    id: "0xcc22b3199013627708d05fedf9b854bd7706a156",
    distributor: {
      id: "0x48889feca4574810e5a5b30b6b93146a837500fb",
      distributorCid: "Qmf8C4mjVGgzxVzWcAevxCHZiCCUG38rxeDC7Byt5tsVoA",
      distributorMetadata: {
        name: "Audius Followers Distributor",
        description:
          "This distributer enables creators to distributes tokens for their followers on Auduis.",
        image: "https://example.com/distributerimage.jpg",
      },
    },
    token: "",
    startDate: "20201212",
    endDate: "20201212",
    creator: {
      id: "",
    },
    status: 0,
    campaignInfoCid: "QmYdUkdEgQtn4viySEQie51JAwrC3xTyDqDbdWXWEwAz5J",
    recipientsCid: "",
    claimAmount: "0",
    claimedNum: 0,
    claims: [],
    checkRequests: [],
    campaignMetadata: {
      name: "Audiusフォロワーさん向けトークン配布キャンペーン！",
      description:
        "Audiusアカウントのフォロワーの方へトークンを配布します。手順はXXX...",
      image: "https://example.com/campaignimage.jpg",
    },
  },
];

export const Default = Template.bind({});
Default.args = {
  tokenState,
  campaignsState,
};

export const NoCampaign = Template.bind({});
NoCampaign.args = {
  tokenState,
  campaignsState: [],
};
