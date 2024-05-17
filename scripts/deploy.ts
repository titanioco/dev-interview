import { ethers } from "hardhat";

async function main() {
  const AaveTransfer = await ethers.getContractFactory("AaveTransfer");
  const aaveTransfer = await AaveTransfer.deploy();

  await aaveTransfer.deployed();

  console.log("AaveTransfer deployed to:", aaveTransfer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
