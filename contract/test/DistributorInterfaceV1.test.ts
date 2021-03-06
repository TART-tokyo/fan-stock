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

import { assert, expect } from "chai";
import { Contract, ContractFactory, Signer } from "ethers";
import { ethers } from "hardhat";
import { DistributorInterfaceV1 } from "../types";

describe("DistributorInterfaceV1", () => {
  let owner: Signer;
  let alice: Signer;
  let distributor: DistributorInterfaceV1;
  let abctoken: Contract;

  beforeEach(async () => {
    const Distributor: ContractFactory = await ethers.getContractFactory(
      "DistributorInterfaceV1"
    );
    const Token: ContractFactory = await ethers.getContractFactory("ERC20Mock");
    [owner, alice] = await ethers.getSigners();
    distributor = (await Distributor.deploy(
      "distributor info cid"
    )) as DistributorInterfaceV1;
    abctoken = await Token.deploy(
      "ABCToken",
      "ABC",
      await owner.getAddress(),
      1000000000
    );
  });

  it("has a cid", async () => {
    const events = await distributor.queryFilter(
      distributor.filters.UpdateDistributorInfo(null)
    );
    const updateEvent = events.find(
      (event) => event.event === "UpdateDistributorInfo"
    );
    if (updateEvent === undefined || updateEvent.args === undefined) {
      assert.fail();
    }
    expect(updateEvent.args.cid).to.equal("distributor info cid");
  });

  it("create campaign do nothing", async () => {
    await distributor.createCampaign(
      "0x33e954d45e481a7c78be8cb27f39277113b2519ef0c0d237ab91a054d4bc4f7a",
      abctoken.address,
      "merkle tree cid",
      "campaign info cid",
      100
    );
  });

  describe("updateDistributorInfo", () => {
    it("emits event", async () => {
      const transaction = await distributor.updateDistributorInfo(
        "new distributor info cid"
      );
      const receipt = await transaction.wait();
      if (receipt.events === undefined) {
        assert.fail();
      }
      const updateEvent = receipt.events.find(
        (event) => event.event === "UpdateDistributorInfo"
      );
      if (updateEvent === undefined || updateEvent.args === undefined) {
        assert.fail();
      }
      expect(updateEvent.args.cid).to.equal("new distributor info cid");
    });

    it("only owner", async () => {
      await distributor.updateDistributorInfo("new distributor info cid");
      await expect(
        distributor
          .connect(alice)
          .updateDistributorInfo("new distributor info cid")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
