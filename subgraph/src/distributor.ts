import { log } from "@graphprotocol/graph-ts";
import { Campaign, Creator, Distributor } from "./types/schema";
import { AudiusFollowersCampaign as CampaignTemplate } from "./types/templates";
import {
  AudiusFollowersDistributor,
  CreateCampaign,
} from "./types/AudiusFollowersDistributor/AudiusFollowersDistributor";
import { AudiusFollowersCampaign } from "./types/templates/AudiusFollowersCampaign/AudiusFollowersCampaign";

export function handleCreateCampaign(event: CreateCampaign): void {
  let distributorId = event.address.toHexString();
  let distributor = Distributor.load(distributorId);
  if (distributor == null) {
    distributor = new Distributor(distributorId);
  }
  let distributorContract = AudiusFollowersDistributor.bind(event.address);
  let callDistributorCid = distributorContract.try_distributorInfoCid();
  if (callDistributorCid.reverted) {
    log.warning("Distributor cid not found. Campaign: {}", [distributorId]);
  } else {
    distributor.distributorCid = callDistributorCid.value;
  }

  let creatorId = event.params.creator.toHexString();
  let creator = Creator.load(creatorId);
  if (creator == null) {
    creator = new Creator(creatorId);
  }

  let campaignId = event.params.campaign.toHexString();
  let campaign = Campaign.load(campaignId);
  if (campaign == null) {
    campaign = new Campaign(campaignId);
  }
  campaign.distributor = event.address.toHexString();
  campaign.token = event.params.token.toHexString();
  campaign.creator = event.params.creator.toHexString();

  let campaignContract = AudiusFollowersCampaign.bind(event.params.campaign);
  let callStartDate = campaignContract.try_startDate();
  if (callStartDate.reverted) {
    log.warning("Start date not found. Campaign: {}", [campaignId]);
  } else {
    campaign.startDate = callStartDate.value;
  }
  let callEndDate = campaignContract.try_endDate();
  if (callEndDate.reverted) {
    log.warning("End date not found. Campaign: {}", [campaignId]);
  } else {
    campaign.endDate = callEndDate.value;
  }
  let callClaimAmount = campaignContract.try_claimAmount();
  if (callClaimAmount.reverted) {
    log.warning("Claim amount not found. Campaign: {}", [campaignId]);
  } else {
    campaign.claimAmount = callClaimAmount.value;
  }
  let callClaimedNum = campaignContract.try_claimedNum();
  if (callClaimedNum.reverted) {
    log.warning("Claimed num not found. Campaign: {}", [campaignId]);
  } else {
    campaign.claimedNum = callClaimedNum.value;
  }
  let callCampaignInfoCid = campaignContract.try_campaignInfoCid();
  if (callCampaignInfoCid.reverted) {
    log.warning("Campaign info cid not found. Campaign: {}", [campaignId]);
  } else {
    campaign.campaignInfoCid = callCampaignInfoCid.value;
  }
  let callRecipientsCid = campaignContract.try_recipientsCid();
  if (callRecipientsCid.reverted) {
    log.warning("Recipients cid not found. Campaign: {}", [campaignId]);
  } else {
    campaign.recipientsCid = callRecipientsCid.value;
  }
  let callStatus = campaignContract.try_status();
  if (callStatus.reverted) {
    log.warning("Status not found. Campaign: {}", [campaignId]);
  } else {
    campaign.status = callStatus.value;
  }

  campaign.save();
  distributor.save();
  creator.save();

  CampaignTemplate.create(event.params.campaign);
}
