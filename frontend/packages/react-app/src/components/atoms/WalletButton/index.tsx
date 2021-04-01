/*
 *     Copyright (C) 2021 TART K.K.
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see https://www.gnu.org/licenses/.
 */

import { Box, Button, Modal, Paper, Typography } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { injected } from "../../../utils/connectors";
import WalletDialog from "../../molecules/WalletDialog";
import Link from "@material-ui/core/Link";

function ellipseAddress(address = "", width = 5): string {
  return `${address.slice(0, width)}...${address.slice(-width)}`;
}

const WalletButton: React.FC = () => {
  const supportChainId = Number.parseInt(process.env.REACT_APP_CHAIN_ID ?? "0");
  const { account, active, chainId, error, activate } = useWeb3React();
  const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError;
  const [open, setOpen] = useState(false);
  const [network, setNetwork] = useState("");

  const appURL = useMemo(() => {
    if (error === undefined) {
      return undefined;
    }
    const match = error.toString().match(/\d+/);
    if (match === null) {
      return undefined;
    }
    console.debug(match);
    const chainId = Number.parseInt(match[0]);
    switch (chainId) {
      case 1:
        return "https://app.iroiro.social";
      case 4:
        return "https://rinkeby.iroiro.social";
      case 42:
        return "https://kovan.iroiro.social";
      case 100:
        return "https://xdai.iroiro.social";
      case 137:
        return "https://matic.iroiro.social";
      default:
        return undefined;
    }
  }, [error]);

  console.debug(!error ? "" : error.toString());

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on && !active && !error) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injected);
      };
      const handleChainChanged = (chainId: number) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(injected);
      };
      const handleAccountsChanged = (accounts: string) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };
      const handleNetworkChanged = (networkId: number) => {
        console.log("Handling 'networkChanged' event with payload", networkId);
        activate(injected);
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("networkChanged", handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect);
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("networkChanged", handleNetworkChanged);
        }
      };
    }
  }, [active, error, activate]);

  useEffect(() => {
    if (supportChainId === 1) {
      setNetwork("Mainnet");
    }
    if (supportChainId === 4) {
      setNetwork("Rinkeby test");
    }
    if (supportChainId === 42) {
      setNetwork("Kovan test");
    }
    if (supportChainId === 100) {
      setNetwork("xDAI");
    }
    if (supportChainId === 137) {
      setNetwork("Matic");
    }
  }, [supportChainId]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box display="flex" style={{ alignItems: "center" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            handleClickOpen();
          }}
        >
          {active && account ? ellipseAddress(account) : "Wallet Connect"}
        </Button>
      </Box>
      {isUnsupportedChainIdError && (
        <Modal
          open
          disablePortal
          disableEnforceFocus
          disableAutoFocus
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper>
            <Box p={5}>
              <Typography variant={"h3"}>
                Switch to a supported Ethereum network
              </Typography>
              <Box mt={2}>
                <Typography>
                  To access Ioriro, please switch to the {network} network.
                </Typography>
              </Box>
              {appURL !== undefined && (
                <Box mt={2}>
                  <Typography>
                    Or you can access an{" "}
                    <Link href={appURL}>app for selected network</Link>.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Modal>
      )}
      <WalletDialog selectedValue={""} open={open} onClose={handleClose} />
    </>
  );
};

export default WalletButton;
