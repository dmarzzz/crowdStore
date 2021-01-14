// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "buidlerevm") {
    console.warn(
      "You are trying to deploy a contract to the Buidler EVM network, which" +
        "gets automatically created and destroyed every time. Use the Buidler" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Push = await ethers.getContractFactory("Push");
  const push = await Push.deploy();
  await push.deployed();

  console.log("Push address:", push.address);

  // We also save the contract's artifacts and address in the client directory
  saveClientFiles(push);
}

function saveClientFiles(push) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../client/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ push: push.address }, undefined, 2)
  );

  fs.copyFileSync(
    __dirname + "/../artifacts/Push.json",
    contractsDir + "/Push.json"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
