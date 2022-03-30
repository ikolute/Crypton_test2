require("@nomiclabs/hardhat-ethers");
require("solidity-coverage");
require("dotenv").config();
require("./task/task");

 module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
      saveDeployments: true,
    },
    
  }
}