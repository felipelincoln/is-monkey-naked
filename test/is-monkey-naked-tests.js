const { fetch } = require("node-fetch")

const { expect } = require("chai")
const { ethers, waffle } = require("hardhat")

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

  this.a = await fetch("https://onchainmonkey.com/ocm-metadata.csv")

})

it("test", function(){
  console.log(this.a)
})
