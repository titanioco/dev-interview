import { ethers, waffle } from "hardhat";
import { expect } from "chai";
import { AavePositionTransfer } from "../contracts/AavePositionTransfer.sol";
import { MockContract, smockit } from "@ethereum-waffle/mock-contract";
import { Contract } from "ethers";

// Interfaces
const IPoolAddressesProviderArtifact = require("@aave/core-v3/artifacts/contracts/interfaces/IPoolAddressesProvider.sol/IPoolAddressesProvider.json");
const IPoolArtifact = require("@aave/core-v3/artifacts/contracts/interfaces/IPool.sol/IPool.json");

describe("AavePositionTransfer", function () {
  let aavePositionTransfer: AavePositionTransfer;
  let mockPoolAddressesProvider: MockContract;
  let mockPool: MockContract;
  let owner: any;
  let wallet1: any;
  let wallet2: any;

  const ASSET_ADDRESS = "0x..."; // Replace with a real asset address

  before(async function () {
    [owner, wallet1, wallet2] = await ethers.getSigners();

    // Deploy mock contracts
    mockPoolAddressesProvider = await smockit(IPoolAddressesProviderArtifact);
    mockPool = await smockit(IPoolArtifact);

    // Mock functions
    mockPoolAddressesProvider.smocked.getPool.will.return.with(mockPool.address);
    mockPool.smocked.getReserveData.will.return.with({
      aTokenAddress: ASSET_ADDRESS,
      variableDebtTokenAddress: ASSET_ADDRESS,
      stableDebtTokenAddress: ASSET_ADDRESS,
      // Add other required reserve data if needed
    });

    // Deploy the AavePositionTransfer contract
    const AavePositionTransfer = await ethers.getContractFactory("AavePositionTransfer");
    aavePositionTransfer = (await AavePositionTransfer.deploy(mockPoolAddressesProvider.address)) as AavePositionTransfer;
    await aavePositionTransfer.deployed();
  });

  it("Should deploy correctly", async function () {
    expect(aavePositionTransfer.address).to.properAddress;
  });

  it("Should transfer collateral and loan positions", async function () {
    const assets = [ASSET_ADDRESS];
    const collateralBalance = ethers.utils.parseUnits("1000", 18); // Example collateral balance
    const debtAmount = ethers.utils.parseUnits("500", 18); // Example debt amount

    // Mock balanceOf for collateral and debt tokens
    const aToken = await smockit(await ethers.getContractAt("IERC20", ASSET_ADDRESS));
    const variableDebtToken = await smockit(await ethers.getContractAt("IERC20", ASSET_ADDRESS));
    const stableDebtToken = await smockit(await ethers.getContractAt("IERC20", ASSET_ADDRESS));

    aToken.smocked.balanceOf.will.return.with(collateralBalance);
    variableDebtToken.smocked.balanceOf.will.return.with(debtAmount);
    stableDebtToken.smocked.balanceOf.will.return.with(0);

    // Mock pool functions
    mockPool.smocked.withdraw.will.return();
    mockPool.smocked.repay.will.return();
    mockPool.smocked.borrow.will.return();

    await expect(aavePositionTransfer.transferPosition(wallet1.address, wallet2.address, assets))
      .to.emit(aavePositionTransfer, "TransferStarted")
      .withArgs(wallet1.address, wallet2.address, ASSET_ADDRESS, collateralBalance)
      .to.emit(aavePositionTransfer, "TransferCompleted")
      .withArgs(wallet1.address, wallet2.address, ASSET_ADDRESS, collateralBalance)
      .to.emit(aavePositionTransfer, "TransferStarted")
      .withArgs(wallet1.address, wallet2.address, ASSET_ADDRESS, debtAmount)
      .to.emit(aavePositionTransfer, "TransferCompleted")
      .withArgs(wallet1.address, wallet2.address, ASSET_ADDRESS, debtAmount);
  });

  it("Should not transfer if no collateral or debt", async function () {
    const assets = [ASSET_ADDRESS];

    // Mock balanceOf for collateral and debt tokens
    const aToken = await smockit(await ethers.getContractAt("IERC20", ASSET_ADDRESS));
    const variableDebtToken = await smockit(await ethers.getContractAt("IERC20", ASSET_ADDRESS));
    const stableDebtToken = await smockit(await ethers.getContractAt("IERC20", ASSET_ADDRESS));

    aToken.smocked.balanceOf.will.return.with(0);
    variableDebtToken.smocked.balanceOf.will.return.with(0);
    stableDebtToken.smocked.balanceOf.will.return.with(0);

    // Mock pool functions
    mockPool.smocked.withdraw.will.return();
    mockPool.smocked.repay.will.return();
    mockPool.smocked.borrow.will.return();

    const tx = await aavePositionTransfer.transferPosition(wallet1.address, wallet2.address, assets);
    const receipt = await tx.wait();
    expect(receipt.events?.length).to.equal(0); // No events should be emitted
  });
});
