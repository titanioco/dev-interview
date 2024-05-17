// SPDX-License-Identifier: UNLICENSED
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
    address public constant AAVE_COLLATERAL_VAULT = address(0x1E0b7E3d45f90c8F41c1631486A3E343F169bE84);

    event TransferCompleted(address indexed from, address indexed to);

    constructor() {}

    function transferPosition(address from, address to) external {
        IAaveCollateralVault vault = IAaveCollateralVault(AAVE_COLLATERAL_VAULT);
        vault.transferCollateralAndLoan(from, to);

        emit TransferCompleted(from, to);
    }
}