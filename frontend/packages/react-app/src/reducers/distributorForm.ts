import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

export type DISTRIBUTOR_ACTIONS =
  | {
      type: "step:set";
      payload: { stepNo: number };
    }
  | {
      type: "approveAmount:set";
      payload: { approveAmount: string };
    }
  | { type: "campaignName:set"; payload: { campaignName: string } }
  | { type: "startDate:set"; payload: { startDate: MaterialUiPickersDate } }
  | { type: "endDate:set"; payload: { endDate: MaterialUiPickersDate } }
  | { type: "token:approve"; payload: { approveRequest: boolean } }
  | {
      type: "campaign:deploy";
      payload: { requestDeployCampaign: boolean };
    };

export interface createCampaignState {
  step: number;
  approveAmount: string;
  campaignName: string;
  startDate: number;
  endDate: number;
  approveRequest: boolean;
  requestDeployCampaign: boolean;
}

export const distributorFormReducer = (
  state: createCampaignState,
  action: DISTRIBUTOR_ACTIONS
): createCampaignState => {
  switch (action.type) {
    case "step:set": {
      return { ...state, step: action.payload.stepNo };
    }
    case "approveAmount:set": {
      return {
        ...state,
        approveAmount: action.payload.approveAmount,
        approveRequest: false,
      };
    }
    case "campaignName:set": {
      return { ...state, campaignName: action.payload.campaignName };
    }
    case "startDate:set": {
      const startDate = Number(action.payload.startDate);
      console.log(startDate);
      return { ...state, startDate: startDate };
    }
    case "endDate:set": {
      const endDate = Number(action.payload.endDate);
      console.log(endDate);
      return { ...state, endDate: endDate };
    }
    case "token:approve": {
      return { ...state, approveRequest: action.payload.approveRequest };
    }
    case "campaign:deploy": {
      return {
        ...state,
        requestDeployCampaign: action.payload.requestDeployCampaign,
      };
    }
    default:
      throw new Error();
  }
};

export const distributorFormInitialState: createCampaignState = {
  step: 1,
  approveAmount: "",
  campaignName: "",
  startDate: new Date("2021-01-01T00:00:00").getTime(),
  endDate: new Date("2021-01-01T00:00:00").getTime(),
  approveRequest: false,
  requestDeployCampaign: false,
};
