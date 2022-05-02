const hre = require("hardhat");
const ethers = hre.ethers;
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", signer.address);

  console.log("Account balance:", (await signer.getBalance()).toString());

  const VotingContract = await ethers.getContractFactory("VotingContract", signer);
  const Votingcontract = await VotingContract.deploy();
  await Votingcontract.deployed();
  console.log("Votingcontract deployed to:", Votingcontract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
