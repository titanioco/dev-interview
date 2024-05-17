// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

contract MockAaveCollateralVault {
    bool private transferSuccessful;

    function setTransferCollateralAndLoan(bool success) external {
        transferSuccessful = success;
    }

    function transferCollateralAndLoan(address, address) external view {
        require(transferSuccessful, "Transfer failed");
    }
}
