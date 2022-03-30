const hre = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
const { isCommunityResourcable } = require("@ethersproject/providers");
chai.use(solidity);
const { expect } = chai;




describe("CrowdFunding contract", function () {

  let CrowdFunding;
  let Crowdfunding;

  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addr4;
  let addr5;
  let addr6;
  let addr7;
  beforeEach(async function () {

      

      [owner,addr1,addr2,addr3,addr4,addr5, addr6,addr7] = await hre.ethers.getSigners();

      CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding", owner);

      Crowdfunding = await CrowdFunding.deploy();

      await Crowdfunding.deployed();
  });
  describe("Deployment", function (){
      it("Should set the right owner", async function () {

          expect(await Crowdfunding.owner()).to.equal(owner.address);

        });
    
        it("Should return right balance Contract", async function () {

          const ContractBalance = await ethers.provider.getBalance(Crowdfunding.address)
          
          ContractBalanceEther = await ethers.utils.formatEther(ContractBalance);
          expect(await  ContractBalanceEther).to.equal('0.0');
        })

  });
  describe("NewVotes", function (){
    it("Should create right Vote", async function () {

      await Crowdfunding.connect(owner).NewVotes('vote1', "Networks cup");
      const realdatalist= [
        'vote1' ,
        "Networks cup",
      ]
      const numVote1 = ethers.BigNumber.from("1");
      Inform = await Crowdfunding.GetVotesInformation(numVote1);
      expect(Inform[0]).to.equal(realdatalist[0])

      expect(Inform[1]).to.equal(realdatalist[1])
      
       
    });
    it("Shouldn't create Vote if you are not owner", async function () {

      await expect(Crowdfunding.connect(addr1).NewVotes('vote1', "Networks cup")
      ).to.be.revertedWith("you are not owner"); 
    });
});
describe("makeProject", function (){
  it("Should create right Project", async function () {

    await Crowdfunding.connect(owner).NewVotes('vote1', "Networks cup");
    
    const numVote1 = ethers.BigNumber.from("1");

    await Crowdfunding.connect(owner).makeProject(1, "proj1" , "0xe3712A59911bdB17fA9149114C4778474D633446" , "Test project to now information");
    
    const realdatalist= [
      "proj1",
      'Test project to now information',
      '0'
    ]
    Inform = await Crowdfunding.GetProjectInformation(1,1)
    expect(Inform[0]).to.equal(realdatalist[0])

    expect(Inform[1]).to.equal(realdatalist[1])

    expect(ethers.utils.formatEther(Inform[2])).to.equal(ethers.utils.formatEther(realdatalist[2]))
    
  });
  it("Shouldn't create Vote if you are not owner", async function () {

    await expect(Crowdfunding.connect(addr1).makeProject(1, "proj1" , "0xe3712A59911bdB17fA9149114C4778474D633446" , "Test project to now information")
    ).to.be.revertedWith("you are not owner"); 
  });
});
describe("supportProject", function (){
  it("Should support right Project", async function () {
    await Crowdfunding.connect(owner).NewVotes('vote1', "Networks cup");
    const numVote1 = ethers.BigNumber.from("1");
    await Crowdfunding.connect(owner).makeProject(1, "proj1" , addr1.address , "Test project to now information");
    await Crowdfunding.connect(owner).makeProject(2, "proj2" , addr2.address , "Test project to now information");
    
    const realdatalist= [
      "proj1",
      'Test project to now information',
      '0.01'
    ]
    const textSend = {
      value: ethers.utils.parseEther('0.01')
    }

    await Crowdfunding.connect(addr1).supportProject(1,1,textSend)

    Inform = await Crowdfunding.connect(addr1).GetProjectInformation(1,1)

    expect(Inform[0]).to.equal(realdatalist[0])

    expect(Inform[1]).to.equal(realdatalist[1])

    expect(Inform[2]).to.equal(textSend.value)
  });
  it("Shouldn't support project if you are already vote in this Voting", async function () {
    const numVote1 = ethers.BigNumber.from("1");
    const realdatalist= [
      "proj1",
      'Test project to now information',
      '0.01'
    ]
    const textSend = {
      value: ethers.utils.parseEther('0.01')
    }

    await Crowdfunding.connect(owner).NewVotes('vote1', "Networks cup");


    await Crowdfunding.connect(owner).makeProject(1, "proj1" , addr1.address , "Test project to now information");
    await Crowdfunding.connect(owner).makeProject(2, "proj2" , addr2.address , "Test project to now information");
    
    

    await Crowdfunding.connect(addr1).supportProject(1,1,textSend)

    await expect(Crowdfunding.connect(addr1).supportProject(1,1,textSend)
    ).to.be.revertedWith("You already make vote in this Votes"); 
  });

  it("Shouldn't support project if try send more tokens", async function () {
    const numVote1 = ethers.BigNumber.from("1");
    const realdatalist= [
      "proj1",
      'Test project to now information',
      '0'
    ]
    const textSend = {
      value: ethers.utils.parseEther('0.02')
    }

    await Crowdfunding.connect(owner).NewVotes('vote1', "Networks cup");


    await Crowdfunding.connect(owner).makeProject(1, "proj1" , addr1.address , "Test project to now information");
    await Crowdfunding.connect(owner).makeProject(2, "proj2" , addr2.address , "Test project to now information"); 

    const ContractBalance = await ethers.provider.getBalance(Crowdfunding.address);
    ContractBalanceEther = await ethers.utils.formatEther(ContractBalance);
    
    await expect(Crowdfunding.connect(addr1).supportProject(1,1,textSend)).to.be.revertedWith("need only 0.01 Ether")
   

  });
  it("Shouldn't support project if time is end", async function () {
    const numVote1 = ethers.BigNumber.from("1");
    const realdatalist= [
      "proj1",
      'Test project to now information',
      '0'
    ]
    const textSend = {
      value: ethers.utils.parseEther('0.01')
    }

    await Crowdfunding.connect(owner).NewVotes('vote1', "Networks cup");


    await Crowdfunding.connect(owner).makeProject(1, "proj1" , addr1.address , "Test project to now information");
    await Crowdfunding.connect(owner).makeProject(2, "proj2" , addr2.address , "Test project to now information"); 

    const ContractBalance = await ethers.provider.getBalance(Crowdfunding.address);
    ContractBalanceEther = await ethers.utils.formatEther(ContractBalance);
    await network.provider.send("evm_increaseTime", [259200])
    await expect(Crowdfunding.connect(addr1).supportProject(1,1,textSend)).to.be.revertedWith('time end')
// может быть нужно прогнать if
  });
});
  describe("GetProjectCount", function (){
  
    it("Should return correct number of total projects", async function () {
        await Crowdfunding.connect(owner).NewVotes('vote1', "Networks cup");


        await Crowdfunding.connect(owner).makeProject(1, "proj1" , addr1.address , "Test project to now information");
        await Crowdfunding.connect(owner).makeProject(1, "proj2" , addr2.address , "Test project to now information");

        const numReal = ethers.BigNumber.from("2");

        const NumReturn = await Crowdfunding.GetProjectCount(1);

        expect(NumReturn).to.eqls(numReal)
    });
    it("Should return 0 if you haven't made projects yet", async function () {
        await Crowdfunding.connect(owner).NewVotes('vote1', "Networks cup");

        const numReal = ethers.BigNumber.from("0");

        const NumReturn = await Crowdfunding.GetProjectCount(1);

        expect(NumReturn).to.eqls(numReal)
    
  });
});
describe("GetVotesCount", function (){
  
  it("Should return correct number of total Votes", async function () {
      await Crowdfunding.connect(owner).NewVotes('vote1', "Networks cup");

      await Crowdfunding.connect(owner).NewVotes('vote2', "Networks cup2");

      await Crowdfunding.connect(owner).NewVotes('vote3', "Networks cup3");



      const numReal = ethers.BigNumber.from("3");

      const NumReturn = await Crowdfunding.GetVotesCount();

      expect(NumReturn).to.eqls(numReal)
  });
  it("Should return 0 if you haven't made projects yet", async function () {
    const numReal = ethers.BigNumber.from("0");

    const NumReturn = await Crowdfunding.GetVotesCount();

    expect(NumReturn).to.eqls(numReal)
  
  });
});
describe("finishVote", function (){
  
  it("Should return an error if 3 days have not passed", async function () {
      await Crowdfunding.connect(owner).NewVotes('vote1', "Networks cup");

      await expect(Crowdfunding.finishVote(1)).to.be.revertedWith("try later")
  });
  it("Should finish vote with correct winner", async function () {
      
    await Crowdfunding.connect(owner).NewVotes('vote1', "Networks cup");

    await Crowdfunding.connect(owner).makeProject(1, "proj1" , addr1.address , "Test project to now information");
    await Crowdfunding.connect(owner).makeProject(1, "proj2" , addr2.address , "Test project to now information");
    const textSend = {
      value: ethers.utils.parseEther('0.01')
    }
    await Crowdfunding.connect(addr1).supportProject(1,1,textSend)

    await Crowdfunding.connect(addr2).supportProject(1,2,textSend)

    await Crowdfunding.connect(addr3).supportProject(1,2,textSend)

    await Crowdfunding.connect(addr4).supportProject(1,1,textSend)

    await Crowdfunding.connect(addr5).supportProject(1,2,textSend)

    await network.provider.send("evm_increaseTime", [259200])

    await Crowdfunding.finishVote(1)
    const winnerinf = await Crowdfunding.getWinnerinform(1)
    expect(ethers.utils.formatEther(winnerinf[1])).to.equal('0.045')
    expect(winnerinf[0]).to.equal('proj2')
  });
});

describe("GetcommissionBalance", function (){
  it("Should return correct commission", async function () {
      
    await Crowdfunding.connect(owner).NewVotes('vote1', "Networks cup");

    await Crowdfunding.connect(owner).makeProject(1, "proj1" , addr1.address , "Test project to now information");
    await Crowdfunding.connect(owner).makeProject(1, "proj2" , addr2.address , "Test project to now information");
    const textSend = {
      value: ethers.utils.parseEther('0.01')
    }
    await Crowdfunding.connect(addr1).supportProject(1,1,textSend)

    await Crowdfunding.connect(addr2).supportProject(1,2,textSend)

    await Crowdfunding.connect(addr3).supportProject(1,2,textSend)

    await Crowdfunding.connect(addr4).supportProject(1,1,textSend)

    await Crowdfunding.connect(addr5).supportProject(1,2,textSend)

    await network.provider.send("evm_increaseTime", [259200])

    await Crowdfunding.finishVote(1)
    const commission = await Crowdfunding.GetcommissionBalance()
    expect(ethers.utils.formatEther(commission)).to.equal('0.005')
    
  });
});
describe("Getcommission", function (){
  
  it("Shouldnt transfer commission if you are not owner", async function () {
    await Crowdfunding.connect(owner).NewVotes('vote1', "Networks cup");

    await Crowdfunding.connect(owner).makeProject(1, "proj1" , addr1.address , "Test project to now information");
    await Crowdfunding.connect(owner).makeProject(1, "proj2" , addr2.address , "Test project to now information");
    const textSend = {
      value: ethers.utils.parseEther('0.01')
    }
    await Crowdfunding.connect(addr1).supportProject(1,1,textSend)

    await Crowdfunding.connect(addr2).supportProject(1,2,textSend)

    await Crowdfunding.connect(addr3).supportProject(1,2,textSend)

    await Crowdfunding.connect(addr4).supportProject(1,1,textSend)

    await Crowdfunding.connect(addr5).supportProject(1,2,textSend)

    await network.provider.send("evm_increaseTime", [259200])

    await Crowdfunding.finishVote(1)
    const textSend2 = {
      value: ethers.utils.parseEther('0.004')
    }
    await expect(Crowdfunding.connect(addr6).Getcommission(addr5.address,textSend2.value)).to.be.revertedWith("you are not owner")

});
  it("Should transfer commision", async function () {
    await Crowdfunding.connect(owner).NewVotes('vote1', "Networks cup");

    await Crowdfunding.connect(owner).makeProject(1, "proj1" , addr1.address , "Test project to now information");
    await Crowdfunding.connect(owner).makeProject(1, "proj2" , addr2.address , "Test project to now information");
    const textSend = {
      value: ethers.utils.parseEther('0.01')
    }
    await Crowdfunding.connect(addr1).supportProject(1,1,textSend)

    await Crowdfunding.connect(addr2).supportProject(1,2,textSend)

    await Crowdfunding.connect(addr3).supportProject(1,2,textSend)

    await Crowdfunding.connect(addr4).supportProject(1,1,textSend)

    await Crowdfunding.connect(addr5).supportProject(1,2,textSend)

    await network.provider.send("evm_increaseTime", [259200])

    await Crowdfunding.finishVote(1)
    const textSend2 = {
      value: ethers.utils.parseEther('0.004')
    }
    await Crowdfunding.connect(owner).Getcommission(addr7.address,textSend2.value)

    const accBalance = await ethers.provider.getBalance(addr7.address);
    accBalanceEther = await ethers.utils.formatEther(accBalance);

    expect(accBalanceEther).to.equal('10000.004')

  });
  it("Should transfer commision", async function () {
    await Crowdfunding.connect(owner).NewVotes('vote1', "Networks cup");

    await Crowdfunding.connect(owner).makeProject(1, "proj1" , addr1.address , "Test project to now information");
    await Crowdfunding.connect(owner).makeProject(1, "proj2" , addr2.address , "Test project to now information");
    const textSend = {
      value: ethers.utils.parseEther('0.01')
    }
    await Crowdfunding.connect(addr1).supportProject(1,1,textSend)

    await Crowdfunding.connect(addr2).supportProject(1,2,textSend)

    await Crowdfunding.connect(addr3).supportProject(1,2,textSend)

    await Crowdfunding.connect(addr4).supportProject(1,1,textSend)

    await Crowdfunding.connect(addr5).supportProject(1,2,textSend)

    await network.provider.send("evm_increaseTime", [259200])

    await Crowdfunding.finishVote(1)
    const textSend2 = {
      value: ethers.utils.parseEther('0.01')
    }
    await expect(Crowdfunding.connect(owner).Getcommission(addr7.address,textSend2.value)).to.be.revertedWith('not enough commission in Contract')


  });
});
describe("getWinnerinform", function (){
  
  it("Should return an error if 3 days have not passed", async function () {
      await Crowdfunding.connect(owner).NewVotes('vote1', "Networks cup");

      const inform = await Crowdfunding.getWinnerinform(1)
      .catch(error => {
        console.log(error.reason);
                             });
      
  });
  it("Should give winner inform if time is end", async function () {
      
    await Crowdfunding.connect(owner).NewVotes('vote1', "Networks cup");

    await Crowdfunding.connect(owner).makeProject(1, "proj1" , addr1.address , "Test project to now information");
    await Crowdfunding.connect(owner).makeProject(1, "proj2" , addr2.address , "Test project to now information");
    const textSend = {
      value: ethers.utils.parseEther('0.01')
    }
    await Crowdfunding.connect(addr1).supportProject(1,1,textSend)

    await Crowdfunding.connect(addr2).supportProject(1,2,textSend)

    await Crowdfunding.connect(addr3).supportProject(1,2,textSend)

    await Crowdfunding.connect(addr4).supportProject(1,1,textSend)

    await Crowdfunding.connect(addr5).supportProject(1,2,textSend)

    await network.provider.send("evm_increaseTime", [259200])

    await Crowdfunding.finishVote(1)

    const realdatalist = {
      Winner: "proj2",
      Sumwin: '0.045'

    }

    const inform = await Crowdfunding.getWinnerinform(1)

    expect(inform[0]).to.equal(realdatalist.Winner)
    expect(ethers.utils.formatEther(inform[1])).to.equal(realdatalist.Sumwin)
    
  });
});
});
  
