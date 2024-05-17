// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AavePositionTransfer {
    IPoolAddressesProvider public immutable poolAddressesProvider;
    IPool public immutable pool;

    event TransferStarted(address indexed from, address indexed to, address asset, uint256 amount);
    event TransferCompleted(address indexed from, address indexed to, address asset, uint256 amount);

    constructor(IPoolAddressesProvider _poolAddressesProvider) {
        poolAddressesProvider = _poolAddressesProvider;
        pool = IPool(_poolAddressesProvider.getPool());
    }

    function transferPosition(
        address from,
        address to,
        address[] calldata assets
    ) external {
        for (uint256 i = 0; i < assets.length; i++) {
            address asset = assets[i];
            
            // Transfer collateral
            uint256 collateralBalance = IERC20(pool.getReserveData(asset).aTokenAddress).balanceOf(from);
            if (collateralBalance > 0) {
                emit TransferStarted(from, to, asset, collateralBalance);
                pool.withdraw(asset, collateralBalance, to);
                emit TransferCompleted(from, to, asset, collateralBalance);
            }

            // Transfer loan positions
            uint256 variableDebt = IERC20(pool.getReserveData(asset).variableDebtTokenAddress).balanceOf(from);
            uint256 stableDebt = IERC20(pool.getReserveData(asset).stableDebtTokenAddress).balanceOf(from);
            
            if (variableDebt > 0) {
                emit TransferStarted(from, to, asset, variableDebt);
                pool.repay(asset, variableDebt, 2, from);
                pool.borrow(asset, variableDebt, 2, 0, to);
                emit TransferCompleted(from, to, asset, variableDebt);
            }

            if (stableDebt > 0) {
                emit TransferStarted(from, to, asset, stableDebt);
                pool.repay(asset, stableDebt, 1, from);
                pool.borrow(asset, stableDebt, 1, 0, to);
                emit TransferCompleted(from, to, asset, stableDebt);
            }
        }
    }
}
