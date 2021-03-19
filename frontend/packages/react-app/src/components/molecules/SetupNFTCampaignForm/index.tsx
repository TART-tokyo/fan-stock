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

import * as React from "react";
import { Box, Button, FormControl, TextField } from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";
import "date-fns";
import {
  createCampaignState,
  DISTRIBUTOR_ACTIONS,
} from "../../../reducers/distributorForm";
import NFTCampaignCard from "../NFTCampaignCard";

export interface SetupNFTCampaignFormProps {
  readonly distributorFormState: createCampaignState;
  readonly distributorFormDispatch: React.Dispatch<DISTRIBUTOR_ACTIONS>;
}

const SetupNFTCampaignForm: React.FC<SetupNFTCampaignFormProps> = ({
  distributorFormDispatch,
  distributorFormState,
}) => {
  // TODO add uploading image logic
  const button = <Button>Upload Image</Button>;

  return (
    <Box>
      <Box mt={3} maxWidth={460}>
        <FormControl fullWidth>
          <Box mb={4}>
            <TextField
              fullWidth
              type="text"
              required
              label="Token Name"
              color="secondary"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                distributorFormDispatch({
                  type: "campaignName:set",
                  payload: { campaignName: event.target.value },
                })
              }
              value={distributorFormState.campaignName}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              type="text"
              label="Description"
              color="secondary"
              variant="outlined"
              inputProps={{ maxLength: 500 }}
              multiline
              rows={4}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                distributorFormDispatch({
                  type: "campaignDescription:set",
                  payload: { campaignDescription: event.target.value },
                })
              }
              value={distributorFormState.campaignDescription}
            />
            <FormHelperText
              style={{ textAlign: "right" }}
            >{`${distributorFormState.campaignDescription.length}/500`}</FormHelperText>
          </Box>
        </FormControl>
        <NFTCampaignCard
          name={distributorFormState.campaignName}
          description={distributorFormState.campaignDescription}
          image={distributorFormState.campaignImagePreview}
          button={button}
        />
      </Box>
    </Box>
  );
};

export default SetupNFTCampaignForm;
