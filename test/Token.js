const { expect } = require("chai");

describe("Token contract", function() {
  it("Deployment should assign the total supply of tokens to the owner", async function() {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");

    const buidlerToken = await Token.deploy();
    await buidlerToken.deployed();

    const ownerBalance = await buidlerToken.balanceOf(owner.getAddress());
    expect(await buidlerToken.totalSupply()).to.equal(ownerBalance);
  });
});
