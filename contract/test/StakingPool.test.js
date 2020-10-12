const {accounts, contract} = require("@openzeppelin/test-environment")
const {constants} = require("@openzeppelin/test-helpers")
const {assert, expect} = require("chai")

const StakingPool = contract.fromArtifact("StakingPool")
const FanToken = contract.fromArtifact("FanToken")

describe("StakingPool", () => {
  const [owner, alice, bob] = accounts;

  beforeEach(async () => {
    this.pool = await StakingPool.new({from: owner})
    this.abctoken = await FanToken.new(
      "ABCToken", "ABC", 1000000000, owner, 5, {from: owner}
    )
    this.xyztoken = await FanToken.new(
      "XYZToken", "XYZ", 1000000000, owner, 5, {from: owner}
    )
  })

  describe("addTokenToStakingList", () => {
    it("add token as staking token", async () => {
      expect(await this.pool.registeredTokens(this.abctoken.address)).to.equal(false)
      await this.pool.addTokenToStakingList(this.abctoken.address, {from: owner})
      expect(await this.pool.registeredTokens(this.abctoken.address)).to.equal(true)
    })

    it("can not add token from non owner", async () => {
      try {
        await this.pool.addTokenToStakingList(this.abctoken.address, {from: alice})
        assert.fail()
      } catch (error) {
        assert(true)
      }
    })
  })

  describe("earned", () => {
    it("return earned amount", async () => {
      expect((await this.pool.earned(alice, constants.ZERO_ADDRESS)).toString()).to.equal("0")
    })
  })

  describe("stake", () => {
    beforeEach(async () => {
      await this.pool.addTokenToStakingList(this.abctoken.address, {from: owner})
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
  })

  describe("withdraw", () => {
    beforeEach(async () => {
      await this.pool.addTokenToStakingList(this.abctoken.address, {from: owner})
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
  })
})
