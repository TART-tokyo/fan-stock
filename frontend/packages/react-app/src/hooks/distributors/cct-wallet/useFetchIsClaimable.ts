import { useCallback } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { CCTWalletCampaign__factory } from "../../../types";

export const useGetIsClaimable = (
  library: Web3Provider | undefined,
  campaignAddress: string,
  fromAddress: string
): (() => Promise<boolean | undefined>) => {
  return useCallback(async () => {
    if (!library || fromAddress === "" || campaignAddress === "") {
      return undefined;
    }
    const signer = library.getSigner();
    const walletAddress = await signer.getAddress();
    const campaign = CCTWalletCampaign__factory.connect(
      campaignAddress,
      signer
    );

    return await campaign.isClaimable(fromAddress, walletAddress);
  }, [library, fromAddress, campaignAddress]);
};
