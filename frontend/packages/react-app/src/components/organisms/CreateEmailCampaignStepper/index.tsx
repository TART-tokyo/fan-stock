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

import React, { useMemo, useState } from "react";
import Button from "@material-ui/core/Button";
import StepContent from "@material-ui/core/StepContent";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import { upperLimit } from "../WalletDistributionTargets";
import { AccountToken } from "../../../interfaces";
import {
  createCampaignState,
  DISTRIBUTOR_ACTIONS,
} from "../../../reducers/distributorForm";
import styled from "styled-components";
import { Box, Typography } from "@material-ui/core";
import theme from "../../../theme/mui-theme";
import { EmailState, EMAIL_ACTIONS } from "../../../reducers/email";
import UploadEmailCsvPane from "../UploadEmailCsvPane";
import { CSVLink } from "react-csv";
import { ACTIONS } from "../../../reducers/token";
import InputTokenAddressStep from "../../molecules/steps/InputTokenAddressStep";
import ApproveTokenStep from "../../molecules/steps/ApproveTokenStep";
import StartCampaignStep from "../../molecules/steps/StartCampaignStep";

export interface CreateEmailCampaignStepperProps {
  readonly tokenInfo: AccountToken;
  readonly tokenDispatch: React.Dispatch<ACTIONS>;
  readonly distributorFormState: createCampaignState;
  readonly distributorFormDispatch: React.Dispatch<DISTRIBUTOR_ACTIONS>;
  readonly emailState: EmailState;
  readonly emailDispatch: React.Dispatch<EMAIL_ACTIONS>;
}

const CreateEmailCampaignStepper = ({
  tokenInfo,
  tokenDispatch,
  distributorFormState,
  distributorFormDispatch,
  emailState,
  emailDispatch,
}: CreateEmailCampaignStepperProps) => {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const urlList = useMemo(() => {
    const list = emailState.rawTargets.map(
      (uuid) =>
        `${window.location.origin}${window.location.pathname}#/explore/${tokenInfo.token?.tokenAddress}/distributors/${emailState.distributorAddress}/campaigns/${distributorFormState.createdCampaignAddress}?uuid=${uuid}`
    );
    return list;
  }, [
    emailState,
    distributorFormState.createdCampaignAddress,
    tokenInfo.token?.tokenAddress,
  ]);

  const emailUrlPair = useMemo(() => {
    return emailState.emailList.map((email, index) => {
      return [email, urlList[index]];
    });
  }, [emailState.emailList, urlList]);
  const csvData = [["Email", "Campaign URL"], ...emailUrlPair];

  const handleStepChange = (stepNumber: number) => {
    distributorFormDispatch({
      type: "step:set",
      payload: { stepNo: stepNumber },
    });
  };

  return (
    <div>
      <Stepper
        activeStep={distributorFormState.step}
        orientation="vertical"
        style={{ maxWidth: 680 }}
      >
        <Step>
          <StepLabel>
            Fill in Token address that you want to distribute
          </StepLabel>
          <StepContent>
            <InputTokenAddressStep
              currentStep={distributorFormState.step}
              tokenInfo={tokenInfo}
              tokenDispatch={tokenDispatch}
              distributorFormState={distributorFormState}
              distributorFormDispatch={distributorFormDispatch}
            />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Upload your fans email list</StepLabel>
          <StepContent>
            <div style={{ marginBottom: 16 }}>
              <UploadEmailCsvPane
                emailState={emailState}
                emailDispatch={emailDispatch}
              />
            </div>
            <Box mt={5}>
              <StyledButton onClick={() => handleStepChange(0)}>
                Back
              </StyledButton>
              <StyledButton
                variant="contained"
                color="secondary"
                disableElevation
                disabled={
                  !emailState.isValidEmails ||
                  emailState.emailList.length === 0 ||
                  upperLimit < emailState.emailList.length
                }
                onClick={() => {
                  emailDispatch({ type: "targets:generate" });
                  handleStepChange(2);
                }}
              >
                Next
              </StyledButton>
            </Box>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Approve your tokens</StepLabel>
          <StepContent>
            <ApproveTokenStep
              currentStep={distributorFormState.step}
              tokenInfo={tokenInfo}
              distributorFormState={distributorFormState}
              distributorFormDispatch={distributorFormDispatch}
            />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Setup basic info</StepLabel>
          <StepContent>
            <StartCampaignStep
              currentStep={distributorFormState.step}
              distributorFormState={distributorFormState}
              distributorFormDispatch={distributorFormDispatch}
            />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Download CSV</StepLabel>
          <StepContent>
            <div>
              <Box mt={2} mb={4}>
                <Typography variant={"body1"} style={{ lineHeight: "1.2" }}>
                  A campaign is created successfully and
                  <span
                    style={{
                      color: theme.palette.secondary.main,
                      fontWeight: "bold",
                      display: "inline-block",
                      padding: "0 4px",
                    }}
                  >
                    {emailState.rawTargets.length}
                  </span>
                  Email addresses that you have uploaded.
                </Typography>
                <Typography style={{ lineHeight: "1.2" }}>
                  Download CSV contains Email and campaign URL pair for each
                  address and send a email for them!
                </Typography>
                <Typography style={{ lineHeight: "1.2" }}>
                  You can send a Email using batch email sending service such as{" "}
                  <a
                    href="https://www.mergemail.co/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    MergeMail
                  </a>
                  ,{" "}
                  <a
                    href="https://www.gmass.co/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GMass
                  </a>{" "}
                  or{" "}
                  <a href="https://yamm.com/" target="_blank" rel="noreferrer">
                    YAMM
                  </a>
                  .
                </Typography>
                <Typography style={{ lineHeight: "1.2" }}>
                  Please note, this file will be deleted after you move from
                  this page, so please be careful.
                </Typography>
              </Box>
            </div>
            <div>
              <StyledCSVLink
                data={csvData}
                onClick={() => setIsDownloaded(true)}
                filename="email-distribution-targets.csv"
              >
                <Button color="secondary" variant="contained" disableElevation>
                  Download CSV file
                </Button>
              </StyledCSVLink>
            </div>
            <Box mt={5}>
              <Button
                variant="contained"
                color="secondary"
                disableElevation
                disabled={!isDownloaded}
                onClick={() => {
                  emailDispatch({ type: "moveToCampaignPage:on" });
                }}
              >
                Go to Campaign Detail
              </Button>
            </Box>
          </StepContent>
        </Step>
      </Stepper>
    </div>
  );
};

const StyledButton = styled(Button)`
  width: 140px;
  margin-right: 8px;
`;

const StyledCSVLink = styled(CSVLink)`
  text-decoration: none;
`;

export default CreateEmailCampaignStepper;
