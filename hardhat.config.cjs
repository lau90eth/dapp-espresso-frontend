require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    optimismSepolia: {
      url: "https://sepolia.optimism.io",
      chainId: 11155420,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      optimismSepolia: "YOUR_OPTIMISM_API_KEY" // Non obbligatorio per testnet
    },
    customChains: [
      {
        network: "optimismSepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimistic.etherscan.io"
        }
      }
    ]
  }
};
