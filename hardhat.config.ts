import { HardhatUserConfig } from "hardhat/config";
import { HardhatNetworkUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers/withArgs"
import "@typechain/hardhat"

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  typechain: {
    outDir: "typechain",
    target: "ethers-v6",
  },
};

export default config;
