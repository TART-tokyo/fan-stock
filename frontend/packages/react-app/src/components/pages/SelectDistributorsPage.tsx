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

import React from "react";
import { RouteComponentProps } from "react-router-dom";
import SelectDistributorsPageTemplate from "../templates/SelectDistributorsPageTemplate";
import distributors from "../../utils/distributors";

const SelectDistributorsPage: React.FC<
  RouteComponentProps<{
    tokenAddress: string;
  }>
> = (props) => {
  const tokenAddress = props.match.params.tokenAddress;
  const result = distributors.filter(
    (distributor) =>
      distributor.id !== "0x590b4465a94be635bf2f760025c61ec3680f687c"
  );
  return (
    <>
      <SelectDistributorsPageTemplate
        tokenAddress={tokenAddress}
        distributors={result}
      />
    </>
  );
};

export default SelectDistributorsPage;
