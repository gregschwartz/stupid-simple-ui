require('@nomicfoundation/hardhat-toolbox');
require("dotenv").config()

module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./app/src/artifacts",
  },
  networks: {
    goerli: {
      url: process.env.REACT_APP_ALCHEMY_URL,
      accounts: [process.env.REACT_APP_GOERLI_PRIVATE_KEY]
    }
  }
};
