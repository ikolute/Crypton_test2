const hre  = require("hardhat");
const ethers = hre.ethers;
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", signer.address);

  console.log("Account balance:", (await signer.getBalance()).toString());

  const CrowdFunding = await ethers.getContractFactory("CrowdFunding", signer);
  const Crowdfunding = await CrowdFunding.deploy();
  await Crowdfunding.deployed();
  console.log("Greeter deployed to:", Crowdfunding.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  // const dep = await donat.connect(owner).NewVotes('vote1', "Networks cup");
  //     const receipt = await dep.wait()
  //     const data = receipt.logs[0].data
  //     const [_name, _Voteifo , campaignID] = ethers.utils.defaultAbiCoder.decode(
  //       ['string','uint256', 'uint256'], data)
      // console.log(`Successful deposit of ${_name.toString()}`)

      // await donat.connect(owner).makeProject(1, "proj1" , "0xe3712A59911bdB17fA9149114C4778474D633446" , "Test project to now information")
      // await donat.connect(owner).makeProject(1, "proj2" , "0xe3712A59911bdB17fA9149114C4778474D633446" , "Test project to now information2")