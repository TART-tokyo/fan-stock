import React from "react";
import {
  Loader,
  Box,
  Flash,
} from "rimble-ui";

import TextInput from "../molecules/TextInput"
import SignInAudius from "../molecules/SignInAudius"
import SignOutAudius from "../molecules/SignOutAudius"
import AudiusAccount from "../molecules/AudiusAccount"
import AudiusAddressInput from "../molecules/AudiusAddressInput"
import AudiusWithdrawToken from "../molecules/AudiusWithdrawToken"

const TokenAudius = ({
  libs,
  myAccount,
  isSigningIn,
  signIn,
  signOut,
  emailRef,
  passwordRef,
  addressInput,
  addressValue,
  addressSubmit,
  distributedAmount,
  withdrawToken,
  isClaimable,
}) => (
  <Box m={4} width={[ 1, 1/2, 1/4]}>
    { !isClaimable && (
      <Flash my={3} variant="danger">
        You can't withdraw tokens from this contract.
      </Flash>
    )}
    {libs && !myAccount && !isSigningIn && (
      <SignInAudius
        emailRef={emailRef}
        passwordRef={passwordRef}
        audiusSignIn={signIn}
      />
    )}
    {isSigningIn && (
      <Loader size="80px" m="auto" />
    )}
    {myAccount && (
      <Box>
        <AudiusAccount
          myAccount={myAccount}
        />
        <AudiusAddressInput
          addressSubmit={addressSubmit}
          addressInput={addressInput}
          addressValue={addressValue}
        />
      </Box>
    )}
    {distributedAmount > 0 &&
      <AudiusWithdrawToken
        distributedAmount={distributedAmount}
        withdrawToken={withdrawToken}
      />
    }
    {myAccount && (
      <SignOutAudius
        audiusSignOut={signOut}
      />
    )}
  </Box>
)

export default TokenAudius
