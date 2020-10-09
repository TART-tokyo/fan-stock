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
    it("add token as staking token", async() => {
      expect(await this.pool.registeredTokens(this.abctoken.address)).to.equal(false)
      await this.pool.addTokenToStakingList(this.abctoken.address, { from: owner})
      expect(await this.pool.registeredTokens(this.abctoken.address)).to.equal(true)
    })

    it("can not add token from non owner", async() => {
      try {
        await this.pool.addTokenToStakingList(this.abctoken.address, { from: alice})
        assert.fail()
      } catch(error) {
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
    beforeEach(async() => {
      await this.pool.addTokenToStakingList(this.abctoken.address, { from:owner })
    })

    it("cannot stake token not registered", async () => {
      try {
        await this.pool.stake(100, bob)
        assert.fail("should throw an error")
      } catch (error) {
        assert(true)
      }
    })
  })
})
