const {accounts, contract} = require("@openzeppelin/test-environment")
const {constants, expectEvent} = require("@openzeppelin/test-helpers")
const {assert, expect} = require("chai")

const StakingPool = contract.fromArtifact("StakingPool")
const FanToken = contract.fromArtifact("FanToken")

describe("StakingPool", () => {
  const [owner, alice, bob] = accounts;

  beforeEach(async () => {
    this.pool = await StakingPool.new({from: owner})
    this.abctoken = await FanToken.new(
      "ABCToken", "ABC", 1000000000, owner, 5, this.pool.address, 50, 5, {from: owner}
    )
    this.xyztoken = await FanToken.new(
      "XYZToken", "XYZ", 1000000000, owner, 5, this.pool.address, 50, 5, {from: owner}
    )
  })

  describe("pauseStakingOf", () => {
    it("throw an error if sender is not a creator", async () => {
      await this.pool.addStakingList(alice, this.abctoken.address, false, {from: owner})
      try {
        await this.pool.pauseStakingOf(this.abctoken.address, {from: alice})
        assert.fail("should throw an error")
      } catch (error) {
        assert(true)
      }
    })

    it("does modify if already paused", async () => {
      await this.pool.addStakingList(alice, this.abctoken.address, true, {from: owner})
      await this.pool.pauseStakingOf(this.abctoken.address, {from: alice})
      expect(await this.pool.tokensStakingPaused(this.abctoken.address)).to.equal(true)
    })

    it("pause staking", async () => {
      await this.pool.addStakingList(alice, this.abctoken.address, false, {from: owner})
      await this.pool.pauseStakingOf(this.abctoken.address, {from: alice})
      expect(await this.pool.tokensStakingPaused(this.abctoken.address)).to.equal(true)
    })
  })

  describe("resumeStakingOf", () => {
    it("throw an error if sender is not a creator", async () => {
      await this.pool.addStakingList(alice, this.abctoken.address, false, {from: owner})
      try {
        await this.pool.resumeStakingOf(this.abctoken.address, {from: alice})
        assert.fail("should throw an error")
      } catch (error) {
        assert(true)
      }
    })

    it("does modify if already resumed", async () => {
      await this.pool.addStakingList(alice, this.abctoken.address, false, {from: owner})
      await this.pool.resumeStakingOf(this.abctoken.address, {from: alice})
      expect(await this.pool.tokensStakingPaused(this.abctoken.address)).to.equal(false)
    })

    it("pause staking", async () => {
      await this.pool.addStakingList(alice, this.abctoken.address, true, {from: owner})
      await this.pool.resumeStakingOf(this.abctoken.address, {from: alice})
      expect(await this.pool.tokensStakingPaused(this.abctoken.address)).to.equal(false)
    })
  })

  describe("tokensTotalSupply", () => {
    beforeEach(async () => {
      await this.pool.addStakingList(alice, this.abctoken.address, false, {from: owner})
    })

    it("returns 0 when token is not registered", async () => {
      expect((await this.pool.tokensTotalSupply(this.xyztoken.address)).toString()).to.equal("0")
    })

    it("incremented by staking", async () => {
      expect((await this.pool.tokensTotalSupply(this.abctoken.address)).toString()).to.equal("0")

      await this.abctoken.transfer(alice, 100, {from: owner})
      await this.abctoken.approve(this.pool.address, 100, {from: alice})
      await this.pool.stake(100, this.abctoken.address, {from: alice})
      expect((await this.pool.tokensTotalSupply(this.abctoken.address)).toString()).to.equal("100")

      await this.abctoken.transfer(bob, 100, {from: owner})
      await this.abctoken.approve(this.pool.address, 100, {from: bob})
      await this.pool.stake(100, this.abctoken.address, {from: bob})
      expect((await this.pool.tokensTotalSupply(this.abctoken.address)).toString()).to.equal("200")
    })

    it("decremented by staking", async () => {
      await this.abctoken.transfer(alice, 100, {from: owner})
      await this.abctoken.approve(this.pool.address, 100, {from: alice})
      await this.pool.stake(100, this.abctoken.address, {from: alice})
      await this.abctoken.transfer(bob, 100, {from: owner})
      await this.abctoken.approve(this.pool.address, 100, {from: bob})
      await this.pool.stake(100, this.abctoken.address, {from: bob})
      expect((await this.pool.tokensTotalSupply(this.abctoken.address)).toString()).to.equal("200")

      await this.pool.withdraw(50, this.abctoken.address, {from: alice})
      expect((await this.pool.tokensTotalSupply(this.abctoken.address)).toString()).to.equal("150")
      await this.pool.withdraw(50, this.abctoken.address, {from: bob})
      expect((await this.pool.tokensTotalSupply(this.abctoken.address)).toString()).to.equal("100")
    })
  })

  describe("addStakingList", () => {
    beforeEach(async () => {
      await this.pool.addStakingList(alice, this.abctoken.address, true, {from: owner})
    })

    it("register token", async () => {
      expect(await this.pool.registeredTokens(this.abctoken.address)).to.equal(true)
    })

    it("register creator", async () => {
      expect(await this.pool.tokensCreator(this.abctoken.address)).to.equal(alice)
    })

    it("register pause status", async () => {
      expect(await this.pool.tokensStakingPaused(this.abctoken.address)).to.equal(true)
    })

    it("can not add token from non owner", async () => {
      try {
        await this.pool.addStakingList(bob, this.abctoken.address, {from: alice})
        assert.fail()
      } catch (error) {
        assert(true)
      }
    })
  })

  describe("earned", () => {
    it("return earned amount", async () => {
      await this.pool.addStakingList(alice, this.abctoken.address, false, {from: owner})
      await this.abctoken.transfer(alice, 100000, {from: owner})
      await this.abctoken.approve(this.pool.address, 100000, {from: alice})
      await this.pool.stake(100000, this.abctoken.address, {from: alice})
      const totalSupply = (await this.abctoken.totalSupply()).toString()
      const decimals = await this.abctoken.decimals();
      expect((await this.pool.earned(alice, this.abctoken.address, totalSupply, decimals)).toString()).to.equal("10")
    })

    it("throw an error if staking paused", async () => {
      await this.pool.addStakingList(alice, this.abctoken.address, true, {from: owner})
      try {
        await this.pool.earned(alice, this.abctoken.address, totalSupply, decimals)
        assert.fail("should throw an error")
      } catch (error) {
        assert(true)
      }
    })
  })

  describe("stake", () => {
    beforeEach(async () => {
      await this.pool.addStakingList(alice, this.abctoken.address, false, {from: owner})
    })

    it("cannot stake token not registered", async () => {
      try {
        await this.pool.stake(100, this.xyztoken.address, {from: alice})
        assert.fail("should throw an error")
      } catch (error) {
        assert(true)
      }
    })

    it("throw an error when user has insufficient token", async () => {
      try {
        await this.pool.stake(100, this.abctoken.address, {from: alice})
        assert.fail("should throw an error")
      } catch (error) {
        assert(true)
      }
    })

    it("throw an error when user does not approve to transfer", async () => {
      try {
        await this.abctoken.transfer(alice, 100, {from: owner})
        expect((await this.abctoken.balanceOf(alice)).toString()).to.equal("100")
        await this.pool.stake(100, this.abctoken.address, {from: alice})
        expect((await this.abctoken.balanceOf(alice)).toString()).to.equal("0")
        assert.fail()
      } catch (error) {
        assert(true)
      }
    })

    it("throw an error if staking is paused", async () => {
      await this.abctoken.transfer(alice, 100, {from: owner})
      expect((await this.abctoken.balanceOf(alice)).toString()).to.equal("100")
      await this.abctoken.approve(this.pool.address, 100, {from: alice})
      await this.pool.pauseStakingOf(this.abctoken.address, {from: alice})

      try {
        await this.pool.stake(50, this.abctoken.address, {from: alice})
        assert.fail()
      } catch (error) {
        assert(true)
      }
    })

    it("staked given amount token from message sender", async () => {
      await this.abctoken.transfer(alice, 100, {from: owner})
      expect((await this.abctoken.balanceOf(alice)).toString()).to.equal("100")
      await this.abctoken.approve(this.pool.address, 100, {from: alice})

      await this.pool.stake(50, this.abctoken.address, {from: alice})
      expect((await this.abctoken.balanceOf(alice)).toString()).to.equal("50")
      expect((await this.pool.balanceOf(alice, this.abctoken.address)).toString()).to.equal("50")

      await this.pool.stake(50, this.abctoken.address, {from: alice})
      expect((await this.abctoken.balanceOf(alice)).toString()).to.equal("0")
      expect((await this.pool.balanceOf(alice, this.abctoken.address)).toString()).to.equal("100")
    })

    it("emit an event", async () => {
      await this.abctoken.transfer(alice, 100, {from: owner})
      await this.abctoken.approve(this.pool.address, 100, {from: alice})
      const receipt = await this.pool.stake(100, this.abctoken.address, {from: alice})
      expectEvent(receipt, "Stake", {
        from: alice,
        token: this.abctoken.address,
        amount: "100"
      })
    })
  })

  describe("withdraw", () => {
    beforeEach(async () => {
      await this.pool.addStakingList(alice, this.abctoken.address, false, {from: owner})
    })

    it("throw an error when balance is less than withdraw amount", async () => {
      try {
        await this.pool.withdraw(1, this.abctoken.address, {from: alice})
        assert.fail("should throw an error")
      } catch (error) {
        assert(true)
      }

      await this.abctoken.transfer(alice, 100, {from: owner})
      await this.abctoken.approve(this.pool.address, 100, {from: alice})
      await this.pool.stake(100, this.abctoken.address, {from: alice})
      try {
        await this.pool.withdraw(101, this.abctoken.address, {from: alice})
        assert.fail("should throw an error")
      } catch (error) {
        assert(true)
        expect((await this.pool.balanceOf(alice, this.abctoken.address)).toString()).to.equal("100")
      }
    })

    it("transfer from pool to message sender", async () => {
      await this.abctoken.transfer(alice, 100, {from: owner})
      await this.abctoken.approve(this.pool.address, 100, {from: alice})
      await this.pool.stake(100, this.abctoken.address, {from: alice})

      await this.pool.withdraw(100, this.abctoken.address, {from: alice})
      expect((await this.pool.balanceOf(alice, this.abctoken.address)).toString()).to.equal("0")
      expect((await this.abctoken.balanceOf(alice)).toString()).to.equal("100")
    })

    it("throw an error if staking paused", async () => {
      await this.pool.addStakingList(alice, this.abctoken.address, true, {from: owner})
      try {
        await this.pool.withdraw(alice, this.abctoken.address, totalSupply, decimals)
        assert.fail("should throw an error")
      } catch (error) {
        assert(true)
      }
    })

    it("emit an event", async () => {
      await this.abctoken.transfer(alice, 100, {from: owner})
      await this.abctoken.approve(this.pool.address, 100, {from: alice})
      await this.pool.stake(100, this.abctoken.address, {from: alice})

      const receipt = await this.pool.withdraw(100, this.abctoken.address, {from: alice})
      expectEvent(receipt, "Withdraw", {
        from: alice,
        token: this.abctoken.address,
        amount: "100"
      })
    })
  })
})
