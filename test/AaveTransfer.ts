// import { ethers, waffle } from "hardhat";
// import { expect } from "chai";
// import { AaveTransfer } from "../contracts/AaveTransfer.ts";
// import { MockContract } from "ethereum-waffle"; 

// describe("AaveTransfer", function () {
//   let aaveTransfer: AaveTransfer;
//   let mockVault: MockContract;
//   let owner: any;
//   let otherAccount: any;

//   const AAVE_COLLATERAL_VAULT = "0x1E0b7E3D45f90c8f41C1631486A3e343F169bE84";
//   const AAVE_LENDING_POOL = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";

//   beforeEach(async function () {
//     [owner, otherAccount] = await ethers.getSigners();

//     // Deploy a mock Aave Collateral Vault contract
//     mockVault = await waffle.mockContractFactory("MockAaveCollateralVault");
//     await mockVault.deploy();

//     // Deploy the AaveTransfer contract
//     const AaveTransfer = await ethers.getContractFactory("AaveTransfer");
//     aaveTransfer = await AaveTransfer.deploy();
//     await aaveTransfer.deployed();
//   });

//   it("Should deploy correctly", async function () {
//     expect(aaveTransfer.address).to.properAddress;
//   });

//   it("Should transfer collateral and loan positions", async function () {
//     // Simulate the transferCollateralAndLoan function in the mock contract
//     await mockVault.mock.transferCollateralAndLoan.returns(true);

//     // Call the transferPosition function
//     await aaveTransfer.transferPosition(owner.address, otherAccount.address);

//     // Verify the TransferCompleted event was emitted
//     await expect(aaveTransfer.transferPosition(owner.address, otherAccount.address))
//       .to.emit(aaveTransfer, "TransferCompleted")
//       .withArgs(owner.address, otherAccount.address);
//   });

//   it("Should fail if transferCollateralAndLoan fails", async function () {
//     // Simulate failure in the transferCollateralAndLoan function in the mock contract
//     await mockVault.mock.transferCollateralAndLoan.returns(false);

//     // Call the transferPosition function and expect it to revert
//     await expect(aaveTransfer.transferPosition(owner.address, otherAccount.address)).to.be.reverted;
//   });
// });
