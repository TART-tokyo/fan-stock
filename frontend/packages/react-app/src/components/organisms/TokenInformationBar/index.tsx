import * as React from "react";
import { TokenInformationState } from "../../../interfaces";
import {
  Container,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import EtherscanLink from "../../atoms/EtherscanLink";

export interface TokenInformationBarProps {
  readonly state: TokenInformationState;
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(4),
  },
}));

const TokenInformationBar = ({
  state: { token, userAddress, userBalance },
}: TokenInformationBarProps) => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Grid container spacing={5}>
        <Grid item xs>
          <Typography variant="h4" component="h1">
            {!!token?.name ? token.name : "Loading token name..."}
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography>Your Balance</Typography>
          <Typography variant="h6">
            {!!userBalance ? userBalance : "Loading balnce..."}
            {" $"}
            {!!token?.symbol && token.symbol}
          </Typography>
        </Grid>
        <Grid item xs>
          <EtherscanLink type="user" address={userAddress} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TokenInformationBar;
