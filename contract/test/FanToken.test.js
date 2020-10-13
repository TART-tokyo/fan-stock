const {accounts, contract} = require("@openzeppelin/test-environment")
const {assert, expect} = require("chai")

const FanToken = contract.fromArtifact("FanToken")

describe("FanToken", () => {
  const [owner, alice, minter] = accounts;

  beforeEach(async () => {
    this.fanStockToken = await FanToken.new(
      "FanStock", "FST", 1000000000, owner, 10, minter, {from: owner}
    )
    this.aliceToken = await FanToken.new(
      "AliceToken", "ALC", 2000000000, alice, 15, minter, {from: owner}
    )
  })

  it("has a name", async () => {
    expect(await this.fanStockToken.name()).to.equal("FanStock");
    expect(await this.aliceToken.name()).to.equal("AliceToken");
  })

  it("has a symbol", async () => {
    expect(await this.fanStockToken.symbol()).to.equal("FST");
    expect(await this.aliceToken.symbol()).to.equal("ALC");
  })

  it("mints a token", async () => {
    expect((await this.fanStockToken.totalSupply()).toString()).to.equal("1000000000")
    expect((await this.aliceToken.totalSupply()).toString()).to.equal("2000000000")
  })

  it("transferred a token to creator", async () => {
    expect((await this.fanStockToken.balanceOf(owner)).toString()).to.equal("1000000000")
    expect((await this.aliceToken.balanceOf(alice)).toString()).to.equal("2000000000")
  })

  it("set decimals given as argument", async () => {
    expect((await this.fanStockToken.decimals()).toString()).to.equal("10")
    expect((await this.aliceToken.decimals()).toString()).to.equal("15")
  })

  it("sender not a minter can not mint a token", async () => {
    try {
      await this.fanStockToken.mint(alice, 100, {from: alice})
      assert.fail()
    } catch (error) {
      assert(true)
    }
  })

  it("minter can mint a token", async () => {
    await this.fanStockToken.mint(alice, 100, {from: minter})
    expect((await this.fanStockToken.balanceOf(alice)).toString()).to.equal("100")
  })
})
