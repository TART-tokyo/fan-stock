import { Target } from "../interfaces";

export type AUDIUS_ACTIONS =
  | {
      type: "email:set";
      payload: { email: string };
    }
  | { type: "password:set"; payload: { password: string } }
  | { type: "followers:set"; payload: { followers: any[] } }
  | { type: "audius:login" }
  | { type: "audius:loggedIn" }
  | { type: "isLibsActive:true" };

export interface AudiusState {
  email: string;
  password: string;
  followers: Target[];
  isSignin: boolean;
  requestSignin: boolean;
  isLibsActive: boolean;
}

export const audiusReducer = (
  state: AudiusState,
  action: AUDIUS_ACTIONS
): AudiusState => {
  switch (action.type) {
    case "email:set": {
      return { ...state, email: action.payload.email };
    }
    case "password:set": {
      return { ...state, password: action.payload.password };
    }
    case "followers:set": {
      const followers: Target[] = action.payload.followers.map((follower) => {
        return {
          handle: follower.handle,
          wallet: follower.wallet,
        };
      });
      return { ...state, followers: followers };
    }
    case "audius:login": {
      return { ...state, requestSignin: true };
    }
    case "audius:loggedIn": {
      return { ...state, isSignin: true, requestSignin: false };
    }
    case "isLibsActive:true": {
      return { ...state, isLibsActive: true };
    }
    default:
      throw new Error();
  }
};

export const audiusInitialState: AudiusState = {
  email: "",
  password: "",
  followers: [],
  isSignin: true,
  requestSignin: true,
  isLibsActive: true,
};
