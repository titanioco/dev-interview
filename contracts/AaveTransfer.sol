// SPDX-License-Identifier: UNLICENSED
/// @custom:dev-run-script deploy.js

pragma solidity ^0.8.24;

interface ILendingPool {
    function flashLoan(
        address receiverAddress,
        address[] memory assets,
        uint256[] memory amounts,
        uint256[] memory modes,
        address onBehalfOf,
        bytes memory params,
        uint16 referralCode
    ) external;
}

interface IAaveCollateralVault {
    function transferCollateralAndLoan(address from, address to) external;
}

contract AaveTransfer {
    address public constant AAVE_LENDING_POOL = address(0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9);
    address public constant AAVE_COLLATERAL_VAULT = address(0x1E0b7E3D45f90c8f41C1631486A3e343F169bE84);


    event TransferCompleted(address indexed from, address indexed to);

    constructor() {}

    function transferPosition(address from, address to) external {
        IAaveCollateralVault vault = IAaveCollateralVault(AAVE_COLLATERAL_VAULT);
        vault.transferCollateralAndLoan(from, to);

        emit TransferCompleted(from, to);
    }
}