require("@nomiclabs/hardhat-ethers");
const { AlchemyWebSocketProvider } = require("@ethersproject/providers");
const contractADR = "0xfa32c900EEc24772fa7e5e767969E704165C25f6"
const DonatArtifact = require('../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json');
const { Contract } = require("ethers");
const { types } = require("hardhat/config");

task("newvote", "create new vote")
    .addParam("account", "The account's address")
    .addParam("votename", " Vote name")
    .addOptionalParam(
        "comment",
        "Information about Vote",
        "information",
        types.string
    )
    .setAction(async (newvote) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = newvote.account
        const signer = new ethers.Wallet(key, provider);
        const CrowdFundingcontract = new ethers.Contract(contractADR, DonatArtifact.abi, signer)

        const Vote = await CrowdFundingcontract.NewVotes(newvote.votename, newvote.comment)
            .catch(error => {
                console.log(error.error.error.error.message);
                process.exit(1);
            });
        const vote = await Vote.wait()
        const NumReturn = await CrowdFundingcontract.connect(signer).GetVotesCount()
        console.log(`Successful 
     Uniq number of contract  ${NumReturn.toString()} /n 
     Vote Name   ${newvote.votename.toString()} 
     Voote Information:   ${newvote.comment.toString()} 
                          `)
    });
task("makeproject", "create new project in vote")
    .addParam("account", "The account's private key")
    .addParam("votenum", " Vote uniq num ")
    .addParam("name", " Project name")
    .addParam("accountwith", "The account's address to withdraw if you win")
    .addOptionalParam(
        "comment",
        "Information about Vote",
        "information",
        types.string
    )
    .setAction(async (makeproject) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = makeproject.account
        const signer = new ethers.Wallet(key, provider);
        const CrowdFundingcontract = new ethers.Contract(contractADR, DonatArtifact.abi, signer)

        const Project = await CrowdFundingcontract.connect(signer).makeProject(makeproject.votenum, makeproject.name, makeproject.accountwith, makeproject.comment)
            .catch(error => {
                console.log(error.error.error.error.message);
                process.exit(1);
            });
        const project = await Project.wait()
        const numVote = ethers.BigNumber.from(makeproject.votenum);
        const NumReturn = await CrowdFundingcontract.GetProjectCount(numVote)

        console.log(`Successful
     Uniq number of Project  ${NumReturn.toString()} 
     Project Name   ${makeproject.name.toString()} 
     Project Information:   ${makeproject.comment.toString()} 
                          `)

    });

task("supportroject", "support project (price 0.01 ether)")
    .addParam("account", "The account's private key")
    .addParam("votenum", " Vote uniq num ")
    .addParam("projectnum", " Project uniq num ")
    .setAction(async (supportproject) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = supportproject.account
        const signer = new ethers.Wallet(key, provider);
        const CrowdFundingcontract = new ethers.Contract(contractADR, DonatArtifact.abi, signer)
        const textSend = {
            value: ethers.utils.parseEther('0.01')
        }
        await CrowdFundingcontract.connect(signer).supportProject(supportproject.votenum, supportproject.projectnum, textSend)
            .catch(error => {
                console.log(error.error.error.error.message);
                process.exit(1);
            });
        console.log(`Successful
    
     Uniq number of Vote  ${supportproject.votenum.toString()} /n 
     Uniq number of Project   ${supportproject.projectnum.toString()}  
                          `)

    });

task("getvotesinformation", "get vote information")
    .addParam("account", "The account's private key")
    .addParam("votenum", " Vote uniq num ")
    .setAction(async (getvotesinformation) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = getvotesinformation.account
        const signer = new ethers.Wallet(key, provider);
        const CrowdFundingcontract = new ethers.Contract(contractADR, DonatArtifact.abi, signer)

        const infromaton = await CrowdFundingcontract.connect(signer).GetVotesInformation(getvotesinformation.votenum)

        var date = new Date().getTime() / 1000;
        var seconds = infromaton[2] - date;

        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor(seconds % (3600 * 24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);

        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

        console.log(`Successful
     Vote Name  ${infromaton[0].toString()}
     Vote information  ${infromaton[1].toString()}
     Time to end  ${dDisplay.toString()} : ${hDisplay.toString()} : ${mDisplay.toString()} : ${sDisplay.toString()}
     Total Projects  ${infromaton[3].toString()}
     Uniq number of Project win now ${infromaton[4].toString()}
     Total support of WinProject (ether)  ${ethers.utils.formatEther(infromaton[5]).toString()}
     Total support (ether)  ${ethers.utils.formatEther(infromaton[6]).toString()}  
                          `)

    });

task("getvotesсount", "get votes count total")
    .addParam("account", "The account's private key")
    .setAction(async (getvotesсount) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = getvotesсount.account
        const signer = new ethers.Wallet(key, provider);

        const CrowdFundingcontract = new ethers.Contract(contractADR, DonatArtifact.abi, signer)

        const count = await CrowdFundingcontract.connect(signer).GetVotesCount()

        console.log(`Successful 
     Total Votes ${count.toString()} 
                          `)

    });

task("getprojectcount", "get projects count total")
    .addParam("account", "The account's private key")
    .addParam("votenum", " Vote uniq num ")
    .setAction(async (getprojectcount) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = getprojectcount.account
        const signer = new ethers.Wallet(key, provider);
        const CrowdFundingcontract = new ethers.Contract(contractADR, DonatArtifact.abi, signer)
        const textSend = {
            value: ethers.utils.parseEther('0.01')
        }
        const count = await CrowdFundingcontract.connect(signer).GetProjectCount(getprojectcount.votenum)

        console.log(`Successful 
     Total Project in this Vote : ${count.toString()} 
                          `)

    });

task("finishvote", "finish vote (after 3 days of project start)")
    .addParam("account", "The account's private key")
    .addParam("votenum", " Vote uniq num ")
    .setAction(async (finishvote) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = finishvote.account
        const signer = new ethers.Wallet(key, provider);
        const CrowdFundingcontract = new ethers.Contract(contractADR, DonatArtifact.abi, signer)

        await CrowdFundingcontract.connect(signer).finishVote(finishvote.votenum)
            .catch(error => {
                console.log(error.error.error.error.message);
                process.exit(1);
            });
        console.log(`Successful 
     
                          `)

    });

task("getwinnerinform", "get information about winner")
    .addParam("account", "The account's private key")
    .addParam("votenum", " Vote uniq num ")
    .setAction(async (getwinnerinform) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = getwinnerinform.account
        const signer = new ethers.Wallet(key, provider);
        const CrowdFundingcontract = new ethers.Contract(contractADR, DonatArtifact.abi, signer)
        const winerinfo = await CrowdFundingcontract.connect(signer).getWinnerinform(getwinnerinform.votenum)
            .catch(error => {
                console.log(error.reason);
                process.exit(1);
            });
        console.log(`Successful 
     Winner ${winerinfo[0].toString()} 
     Sum win ${ethers.utils.formatEther(winerinfo[1]).toString()} 
                          `)

    });

task("getcommissionbalance", "get comission balance")
    .addParam("account", "The account's private key")
    .setAction(async (getcommissionbalance) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = getcommissionbalance.account
        const signer = new ethers.Wallet(key, provider);
        const CrowdFundingcontract = new ethers.Contract(contractADR, DonatArtifact.abi, signer)

        const balance = await CrowdFundingcontract.connect(signer).GetcommissionBalance()
            .catch(error => {
                console.log(error.reason);
                process.exit(1);
            });

        console.log(`Successful 
    Commission  balance :  ${ethers.utils.formatEther(balance).toString()} 
                          `)
    });

task("getcommission", "transfer commision (only for owner)")
    .addParam("account", "The account's private key")
    .addParam("address", " account address to withdraw")
    .addParam("amount", " amount to wtihdraw (ether)")
    .setAction(async (getcommission) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = getcommission.account
        const signer = new ethers.Wallet(key, provider);
        const CrowdFundingcontract = new ethers.Contract(contractADR, DonatArtifact.abi, signer)

        const Sum = {
            value: ethers.utils.parseEther(getcommission.amount)
        }
        await CrowdFundingcontract.connect(signer).Getcommission(getcommission.address, Sum.value)
            .catch(error => {
                console.log(error.error.error.error.message);
                process.exit(1);
            });
        console.log(`Successful `)

    });