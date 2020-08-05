const { expect } = require("chai");

describe("Push contract", function () {
  it("2 tokens should be minted", async function () {
    const [owner] = await ethers.getSigners();

    const Push = await ethers.getContractFactory("Push");

    const PushToken = await Push.deploy();
    await PushToken.deployed();

    // const before = await PushToken.totalSupply();

    // const mint1 = await PushToken.mint(owner.getAddress());
    // const mint2 = await PushToken.mint(owner.getAddress());

    // const after = await PushToken.totalSupply();
    
    const associate = await PushToken.associateFiladdress('t3u7rwbnltt3wjqabp3ajhqp6d6znvsxlgf5x6hrxixrulyjrpxaex7p7vca625elbghm4w755ktxpu7pt5xja')

    const deassociate = await PushToken.getFiladdress('3u7rwbnltt3wjqabp3ajhqp6d6znvsxlgf5x6hrxixrulyjrpxaex7p7vca625elbghm4w755ktxpu7pt5xja')

    console.log('deassociate : ', deassociate);

    // console.log("before : ", before);
    // console.log("after : ", after);

    // console.log(PushToken)

  });
});

