const hre = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
const { isCommunityResourcable } = require("@ethersproject/providers");
const { providers } = require("web3");
chai.use(solidity);
const { expect } = chai;




describe("CrowdFunding contract", function () {

  let CrowdFunding;

  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addr4;
  let addr5;
  let addr6;
  let addr7;
  beforeEach(async function () {



    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7] = await hre.ethers.getSigners();

    VotingContract = await hre.ethers.getContractFactory("VotingContract", owner);

    VotingContract = await VotingContract.deploy();

    await VotingContract.deployed();
  });
  describe("CreateVoting", function () {
    it("Should create right Voting", async function () {

      const Voting = await VotingContract.connect(owner).CreateVoting('vote1', "Networks cup");

      await expect(Voting).to.emit(VotingContract, "SubmitCreatevoting").withArgs('vote1', "Networks cup")
    });
    it("Shouldn't create Vote if you are not owner", async function () {

      await expect(VotingContract.connect(addr1).CreateVoting('vote1', "Networks cup")
      ).to.be.revertedWith("you are not owner");
    });
  });
  describe("CreateCandidate", function () {
    it("Should create right Candidate", async function () {
    
      await VotingContract.connect(owner).CreateVoting('vote1', "Networks cup");
    
      const Create = await VotingContract.connect(owner).CreateCandidate('vote1', "proj1", "Test project to now information", "0xe3712A59911bdB17fA9149114C4778474D633446");
          
      await expect(Create).to.emit(VotingContract, "SubmitCreateCandidate").withArgs('vote1', "proj1", "Test project to now information", "0xe3712A59911bdB17fA9149114C4778474D633446")
          
    });
    it("Shouldn't create Candidate if you are not owner", async function () {
    
      await expect(VotingContract.connect(addr1).CreateCandidate('vote1', "proj1", "Test project to now information", "0xe3712A59911bdB17fA9149114C4778474D633446")
      ).to.be.revertedWith("you are not owner");
    });
  });
  describe("SupportCandidate", function () {
    it("Should support right candidate", async function () {
      await VotingContract.connect(owner).CreateVoting('vote1', "Networks cup");
    
      await VotingContract.connect(owner).CreateCandidate('vote1', "proj1", "Test project information", addr1.address);
      await VotingContract.connect(owner).CreateCandidate('vote1', "proj2", "2 Test project information", addr2.address);
      const textSend = {
                value: ethers.utils.parseEther('0.01')
              }
      const Support = await VotingContract.connect(addr3).SupportCandidate('vote1', "proj2",textSend);
      await expect(Support).to.emit(VotingContract, "SubmitSupportCandidate").withArgs('vote1', "proj2")
    });
    it("Shouldn't support candidate if you are already vote in this Voting", async function () {
      await VotingContract.connect(owner).CreateVoting('vote1', "Networks cup");

      await VotingContract.connect(owner).CreateCandidate('vote1', "proj1", "Test project information", addr1.address);
      await VotingContract.connect(owner).CreateCandidate('vote1', "proj2", "2 Test project information", addr2.address);

      const textSend = {
                value: ethers.utils.parseEther('0.01')
              }
      await VotingContract.connect(addr3).SupportCandidate('vote1', "proj2",textSend);

      await expect(VotingContract.connect(addr3).SupportCandidate('vote1', "proj2",textSend)
      ).to.be.revertedWith("You already support Candidate in this Voting");
    });

    it("Shouldn't support candidate if try send more tokens", async function () {
      await VotingContract.connect(owner).CreateVoting('vote1', "Networks cup");

      await VotingContract.connect(owner).CreateCandidate('vote1', "proj1", "Test project information", addr1.address);
      await VotingContract.connect(owner).CreateCandidate('vote1', "proj2", "2 Test project information", addr2.address);

      const textSend = {
                value: ethers.utils.parseEther('0.02')
              }
      await expect(VotingContract.connect(addr3).SupportCandidate('vote1', "proj2",textSend)
      ).to.be.revertedWith("need only 0.01 Ether");


    });
    it("Shouldn't support candidate if time is end", async function () {
      await VotingContract.connect(owner).CreateVoting('vote1', "Networks cup");

      await VotingContract.connect(owner).CreateCandidate('vote1', "proj1", "Test project information", addr1.address);
      await VotingContract.connect(owner).CreateCandidate('vote1', "proj2", "2 Test project information", addr2.address);

      const textSend = {
                value: ethers.utils.parseEther('0.01')
              }
      await network.provider.send("evm_increaseTime", [259200])
      await expect(VotingContract.connect(addr3).SupportCandidate('vote1', "proj2",textSend)).to.be.revertedWith('time end')
    });
  });
  describe("GetAllVotings", function () {
    it("Should return right Votings", async function () {
      await VotingContract.connect(owner).CreateVoting('vote1', "Networks cup");
      await VotingContract.connect(owner).CreateVoting('vote2', "2Networks cup");
      await VotingContract.connect(owner).CreateVoting('vote3', "3Networks cup");

      const Votings = await VotingContract.GetAllVotings();

      await expect(Votings[0]).to.be.equal('vote1')
      await expect(Votings[1]).to.be.equal('vote2')
      await expect(Votings[2]).to.be.equal('vote3')

    });
  });
  describe("GetInformationAboutVoting", function () {
    it("Should return right information about Voting", async function () {
      await VotingContract.connect(owner).CreateVoting('vote1', "Networks cup");
      
      const v1 = await VotingContract.connect(owner).CreateCandidate('vote1', "proj1", "Test project information", addr1.address);
      const v2 =await VotingContract.connect(owner).CreateCandidate('vote1', "proj2", "2 Test project information", addr2.address);
      const v3 =await VotingContract.connect(owner).CreateCandidate('vote1', "proj3", "3 Test project information", addr3.address);

      const textSend = {
        value: ethers.utils.parseEther('0.01')
      }
      await VotingContract.connect(addr1).SupportCandidate("vote1", "proj1", textSend)
      await VotingContract.connect(addr2).SupportCandidate("vote1", "proj2", textSend)
      await VotingContract.connect(addr3).SupportCandidate("vote1", "proj3", textSend)
      await VotingContract.connect(addr4).SupportCandidate("vote1", "proj2", textSend)
      await VotingContract.connect(addr5).SupportCandidate("vote1", "proj2", textSend)

      const VotingInform = await VotingContract.GetInformationAboutVoting('vote1')

      await expect(VotingInform[0][0]).to.be.equal('proj1')
      await expect(VotingInform[1][0]).to.be.equal('Test project information')
      await expect(ethers.utils.formatEther((VotingInform[2][0]))).to.be.equal('0.01')

      await expect(VotingInform[0][1]).to.be.equal('proj2')
      await expect(VotingInform[1][1]).to.be.equal('2 Test project information')
      await expect(ethers.utils.formatEther((VotingInform[2][1]))).to.be.equal('0.03')


    });
  });
  describe("FinishVote", function () {
    it("Should return right information about FinishVote", async function () {
      await VotingContract.connect(owner).CreateVoting('vote1', "Networks cup");
      
      const v1 = await VotingContract.connect(owner).CreateCandidate('vote1', "proj1", "Test project information", addr5.address);
      const v2 =await VotingContract.connect(owner).CreateCandidate('vote1', "proj2", "2 Test project information", addr6.address);
      const v3 =await VotingContract.connect(owner).CreateCandidate('vote1', "proj3", "3 Test project information", addr7.address);

      const textSend = {
        value: ethers.utils.parseEther('0.01')
      }
      await VotingContract.connect(addr1).SupportCandidate("vote1", "proj1", textSend)
      await VotingContract.connect(addr2).SupportCandidate("vote1", "proj2", textSend)
      await VotingContract.connect(addr3).SupportCandidate("vote1", "proj3", textSend)
      await VotingContract.connect(addr4).SupportCandidate("vote1", "proj2", textSend)
      await VotingContract.connect(addr5).SupportCandidate("vote1", "proj2", textSend)

      await network.provider.send("evm_increaseTime", [259200])

      const finish = await VotingContract.connect(addr5).finishVote('vote1')      

      await expect(finish).to.emit(VotingContract, "SubmitFinishVoting").withArgs('vote1', ethers.utils.parseEther('0.045'))
      const accBalance3 = await ethers.provider.getBalance(addr6.address)
      accBalanceEther3 = await ethers.utils.formatEther(accBalance3);
      await expect(accBalanceEther3).to.be.equal('10000.045')
      
    });
    it("Should return error if Voting already finished", async function () {
      await VotingContract.connect(owner).CreateVoting('vote1', "Networks cup");
      
      const v1 = await VotingContract.connect(owner).CreateCandidate('vote1', "proj1", "Test project information", addr5.address);
      const v2 =await VotingContract.connect(owner).CreateCandidate('vote1', "proj2", "2 Test project information", addr6.address);
      const v3 =await VotingContract.connect(owner).CreateCandidate('vote1', "proj3", "3 Test project information", addr7.address);

      const textSend = {
        value: ethers.utils.parseEther('0.01')
      }
      await VotingContract.connect(addr1).SupportCandidate("vote1", "proj1", textSend)
      await VotingContract.connect(addr2).SupportCandidate("vote1", "proj2", textSend)

      await network.provider.send("evm_increaseTime", [259200])

      await VotingContract.connect(addr5).finishVote('vote1')
      await expect(VotingContract.connect(addr3).finishVote('vote1')).to.be.revertedWith('Voting already finished')

    });
    it("Should return error if three days have not passed ", async function () {
      await VotingContract.connect(owner).CreateVoting('vote1', "Networks cup");
      
      const v1 = await VotingContract.connect(owner).CreateCandidate('vote1', "proj1", "Test project information", addr5.address);
      const v2 =await VotingContract.connect(owner).CreateCandidate('vote1', "proj2", "2 Test project information", addr6.address);
      const v3 =await VotingContract.connect(owner).CreateCandidate('vote1', "proj3", "3 Test project information", addr7.address);

      const textSend = {
        value: ethers.utils.parseEther('0.01')
      }
      await VotingContract.connect(addr1).SupportCandidate("vote1", "proj1", textSend)
      await VotingContract.connect(addr2).SupportCandidate("vote1", "proj2", textSend)

      await expect(VotingContract.connect(addr3).finishVote('vote1')).to.be.revertedWith('try later')

    }); 
  });
  describe("GetcommissionBalance", function () {
    it("Should return right Comission Balance", async function () {
      await VotingContract.connect(owner).CreateVoting('vote1', "Networks cup");
      
      const v1 = await VotingContract.connect(owner).CreateCandidate('vote1', "proj1", "Test project information", addr5.address);
      const v2 =await VotingContract.connect(owner).CreateCandidate('vote1', "proj2", "2 Test project information", addr6.address);
      const v3 =await VotingContract.connect(owner).CreateCandidate('vote1', "proj3", "3 Test project information", addr7.address);

      const textSend = {
        value: ethers.utils.parseEther('0.01')
      }
      await VotingContract.connect(addr1).SupportCandidate("vote1", "proj1", textSend)
      await VotingContract.connect(addr2).SupportCandidate("vote1", "proj2", textSend)
      await VotingContract.connect(addr3).SupportCandidate("vote1", "proj3", textSend)
      await VotingContract.connect(addr4).SupportCandidate("vote1", "proj2", textSend)
      await VotingContract.connect(addr5).SupportCandidate("vote1", "proj2", textSend)

      await network.provider.send("evm_increaseTime", [259200])

      await VotingContract.connect(addr5).finishVote('vote1') 
      const Comission = await VotingContract.connect(owner).GetcommissionBalance()
      expect (ethers.utils.formatEther(Comission)).to.be.equal("0.005")

    });
  });
  describe("Transfercommission", function () {
    it("Should transfer Comission", async function () {
      await VotingContract.connect(owner).CreateVoting('vote1', "Networks cup");
      
      const v1 = await VotingContract.connect(owner).CreateCandidate('vote1', "proj1", "Test project information", addr5.address);
      const v2 =await VotingContract.connect(owner).CreateCandidate('vote1', "proj2", "2 Test project information", addr6.address);
      const v3 =await VotingContract.connect(owner).CreateCandidate('vote1', "proj3", "3 Test project information", addr7.address);

      const textSend = {
        value: ethers.utils.parseEther('0.01')
      }
      await VotingContract.connect(addr1).SupportCandidate("vote1", "proj1", textSend)
      await VotingContract.connect(addr2).SupportCandidate("vote1", "proj2", textSend)
      await VotingContract.connect(addr3).SupportCandidate("vote1", "proj3", textSend)
      await VotingContract.connect(addr4).SupportCandidate("vote1", "proj2", textSend)
      await VotingContract.connect(addr5).SupportCandidate("vote1", "proj2", textSend)

      await network.provider.send("evm_increaseTime", [259200])

      await VotingContract.connect(addr5).finishVote('vote1') 
      const value = ethers.utils.parseEther('0.004')
      await VotingContract.connect(owner).Transfercommission(addr7.address, value)

      const accBalance3 = await ethers.provider.getBalance(addr7.address)
      accBalanceEther3 = await ethers.utils.formatEther(accBalance3);
      await expect(accBalanceEther3).to.be.equal('10000.004')

    });
    it("Shouldnt transfer Comission if not enough tokens", async function () {
      await VotingContract.connect(owner).CreateVoting('vote1', "Networks cup");
      
      const v1 = await VotingContract.connect(owner).CreateCandidate('vote1', "proj1", "Test project information", addr5.address);
      const v2 =await VotingContract.connect(owner).CreateCandidate('vote1', "proj2", "2 Test project information", addr6.address);
      const v3 =await VotingContract.connect(owner).CreateCandidate('vote1', "proj3", "3 Test project information", addr7.address);

      const textSend = {
        value: ethers.utils.parseEther('0.01')
      }
      await VotingContract.connect(addr1).SupportCandidate("vote1", "proj1", textSend)
      await VotingContract.connect(addr2).SupportCandidate("vote1", "proj2", textSend)
      await VotingContract.connect(addr3).SupportCandidate("vote1", "proj3", textSend)
      await VotingContract.connect(addr4).SupportCandidate("vote1", "proj2", textSend)
      await VotingContract.connect(addr5).SupportCandidate("vote1", "proj2", textSend)

      await network.provider.send("evm_increaseTime", [259200])

      await VotingContract.connect(addr5).finishVote('vote1') 
      const value = ethers.utils.parseEther('0.01')

      await expect(VotingContract.connect(owner).Transfercommission(addr7.address, value)).to.be.revertedWith('not enough commission in Contract')

    });
  });
  describe("getWinnerinform", function () {
  it("Shouldnt return correct informayion about Winner", async function () {
    await VotingContract.connect(owner).CreateVoting('vote1', "Networks cup");
    
    const v1 = await VotingContract.connect(owner).CreateCandidate('vote1', "proj1", "Test project information", addr5.address);
    const v2 =await VotingContract.connect(owner).CreateCandidate('vote1', "proj2", "2 Test project information", addr6.address);
    const v3 =await VotingContract.connect(owner).CreateCandidate('vote1', "proj3", "3 Test project information", addr7.address);

    const textSend = {
      value: ethers.utils.parseEther('0.01')
    }
    await VotingContract.connect(addr1).SupportCandidate("vote1", "proj1", textSend)
    await VotingContract.connect(addr2).SupportCandidate("vote1", "proj2", textSend)
    await VotingContract.connect(addr3).SupportCandidate("vote1", "proj3", textSend)
    await VotingContract.connect(addr4).SupportCandidate("vote1", "proj2", textSend)
    await VotingContract.connect(addr5).SupportCandidate("vote1", "proj2", textSend)

    await network.provider.send("evm_increaseTime", [259200])

    await VotingContract.connect(addr5).finishVote('vote1') 
    

    const INFrom = await VotingContract.connect(owner).getWinnerinform('vote1')
    expect(ethers.utils.formatEther(INFrom[1])).to.be.equal('0.045')
    expect(INFrom[0]).to.be.equal('proj2')
  });
});
});