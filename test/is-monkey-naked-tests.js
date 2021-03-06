const fs = require("fs")

const { expect } = require("chai")
const { ethers, waffle } = require("hardhat")

const nakedIds =
  fs.readFileSync("./test/ocm-metadata.csv")
    .toString()
    .split("\n")
    .map(row => row.split(","))
    .filter(([, hat, , clothes, , earrings, ..._]) => hat + clothes + earrings == "000")
    .map(([id, ..._]) => id)

const notNakedIds =
  [...Array(10001).keys()]
    .map(x => x.toString())
    .filter(x => !nakedIds.includes(x))

before(async function() {
  // deploy OCM contract
  let OnChainMonkey = await ethers.getContractFactory("OnChainMonkey")
  let { address: onChainMonkeyAddress } = await OnChainMonkey.deploy()

  // deploy BytesUtils external library
  let BytesUtils = await ethers.getContractFactory("BytesUtils")
  let { address: bytesUtilsAddress } = await BytesUtils.deploy()

  // deploy IsMonkeyNaked contract
  let IsMonkeyNaked = await ethers.getContractFactory("IsMonkeyNaked", {libraries: {BytesUtils: bytesUtilsAddress}})
  this.isMonkeyNaked = await IsMonkeyNaked.deploy(onChainMonkeyAddress)
})

describe("isNaked", function(){
  it(`successfully returns true for all ${nakedIds.length} naked monkeys`, async function(){
    for(const id of nakedIds){
      expect(await this.isMonkeyNaked.isNaked(id)).to.true
    }
  })

  it("successfully returns false for 300 random not naked monkeys", async function(){
    for(let i=0; i<300; i++){
      let id = notNakedIds.random()
      expect(await this.isMonkeyNaked.isNaked(id)).to.false
    }
  })

  it("reverts when tokenId is less than 0 or greater than 12839", async function(){
    await expect(this.isMonkeyNaked.isNaked(-1)).to.reverted
    await expect(this.isMonkeyNaked.isNaked(12840)).to.reverted
  })
})

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}
