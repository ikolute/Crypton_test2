require("@nomiclabs/hardhat-ethers");
require("solidity-coverage");
require("dotenv").config();
require("./task/task");


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const [account] = await hre.ethers.getSigners();
  account.accountsBalance = 0;
  
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
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