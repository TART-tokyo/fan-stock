import * as React from "react";
import { Link, Typography } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

type AddressTypes = "user" | "token";

export interface EtherscanLinkProps {
  readonly type?: AddressTypes;
  readonly address?: string;
}

// TODO enable switch network, url regard to address type
const EtherscanLink = ({ type, address }: EtherscanLinkProps) => {
  if (!address) {
    return null;
  }
  const link =
    type === "user"
      ? `https://rinkeby.etherscan.io/address/${address}`
      : `https://rinkeby.etherscan.io/token/${address}`;

  return (
    <Typography>
      <Link href={link}>
        View on Etherscan
        <FontAwesomeIcon icon={faExternalLinkAlt} />
      </Link>
    </Typography>
  );
};

export default EtherscanLink;
