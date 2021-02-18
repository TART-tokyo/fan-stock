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

const WalletDistributor = artifacts.require("WalletDistributor");

const distributorInfoCid = "QmdSXpkw3upd6bDTCx2KReMVBYFo8yJon8KW3WEsqcrDc8";

module.exports = async (deployer) => {
  await deployer.deploy(WalletDistributor, distributorInfoCid);
};
