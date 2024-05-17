import { ethers } from "hardhat";

async function main() {
  const aaveTransferAddress = "<contract-address>"; // Replace with your contract address
  const AaveTransfer = await ethers.getContractFactory("AaveTransfer");
  const aaveTransfer = await AaveTransfer.attach(aaveTransferAddress);

  const wallet1 = "<wallet1-address>"; // Replace with Wallet 1 address
  const wallet2 = "<wallet2-address>"; // Replace with Wallet 2 address

  await aaveTransfer.transferPosition(wallet1, wallet2);

  console.log("Aave position transferred from", wallet1, "to", wallet2);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
