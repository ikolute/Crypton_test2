require("@nomiclabs/hardhat-ethers");
const { AlchemyWebSocketProvider } = require("@ethersproject/providers");
const contractADR = "0x6dE7f664151A3d83a27aD110C21c14044Aca57eD"
const DonatArtifact = require('../artifacts/contracts/VotingContract.sol/VotingContract.json');
const { Contract } = require("ethers");
const { types } = require("hardhat/config");

task("createvoting", "create new voting")
    .addParam("account", "The account's address")
    .addOptionalParam(
        "votingname",
        "votingname",
        "votingname",
        types.string
    )
    .addOptionalParam(
        "comment",
        "Information about Vote",
        "information",
        types.string
    )
    .setAction(async (createvoting) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = createvoting.account
        const signer = new ethers.Wallet(key, provider);
        const VotingContract = new ethers.Contract(contractADR, DonatArtifact.abi, signer)

        const Vote = await VotingContract.CreateVoting(createvoting.votingname, createvoting.comment)
            .catch(error => {
                console.log(error.error.error.error.message);
                process.exit(1);
            });

        const reciept = await Vote.wait();
        
        console.log(`Successful
            Voting name - ${reciept.events[0].args[0]}
            Voting information - ${reciept.events[0].args[1]}
            `);
  
    });
task("createcandidate", "create new candidate in voting")
    .addParam("account", "The account's private key")
    .addParam("accountwith", "The account's address to withdraw if you win")
    .addOptionalParam(
        "votingname",
        "votingname",
        "votingname",
        types.string
    )
    .addOptionalParam(
        "candidatename",
        "Candidate name",
        "candidatename",
        types.string
    )
    .addOptionalParam(
        "comment",
        "Information about Vote",
        "information",
        types.string
    )
    .setAction(async (createcandidate) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = createcandidate.account;
        const signer = new ethers.Wallet(key, provider);
        const VotingContract = new ethers.Contract(contractADR, DonatArtifact.abi, signer);

        const Vote = await VotingContract.CreateCandidate(createcandidate.votingname, createcandidate.candidatename,createcandidate.comment, createcandidate.accountwith )
            .catch(error => {
                console.log(error.error.error.error.message);
                process.exit(1);
            });

        const reciept = await Vote.wait();
        console.log(`Successful
            Voting name - ${reciept.events[0].args[0]}
            Candidate name - ${reciept.events[0].args[1]}
            Candidate information - ${reciept.events[0].args[2]}
            Candidate address to withdraw - ${reciept.events[0].args[3]}
            `);
    });
task("getvotings", "Return all Votings") 
    .addParam("account", "The account's private key")
    .setAction(async (getvotings) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = getvotings.account;
        const signer = new ethers.Wallet(key, provider);
        const VotingContract = new ethers.Contract(contractADR, DonatArtifact.abi, signer);

        const Vote = await VotingContract.GetAllVotings()
        for (i=0;i<Vote.length; i++){
        console.log(`
            Voting name - ${Vote[i]}
            `);
        }
    });  
task("getinformationaboutvoting", "Return information about Candidates")
    .addParam("account", "The account's private key")
    .addOptionalParam(
        "votingname",
        "votingname",
        "votingname",
        types.string
    )
    .setAction(async (getinformationaboutvoting) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = getinformationaboutvoting.account;
        const signer = new ethers.Wallet(key, provider);
        const VotingContract = new ethers.Contract(contractADR, DonatArtifact.abi, signer);

        const [_CandidatesName,_CandidatesInformation, _SupportAmount, deadline] = await VotingContract.GetInformationAboutVoting(getinformationaboutvoting.votingname)
           
        for (i=0;i<_CandidatesName.length; i++){
            console.log(`
                Candidate name - ${_CandidatesName[i]}
                Candidate Information - ${_CandidatesInformation[i]}
                Candidate Support sum - ${ethers.utils.formatEther(_SupportAmount[i])}
                `);
            }
        var date = new Date().getTime() / 1000;
        var seconds = deadline - date;
    
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor(seconds % (3600 * 24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
    
        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

        console.log(`
            Time to end  - ${dDisplay.toString()} : ${hDisplay.toString()} : ${mDisplay.toString()} : ${sDisplay.toString()}`)
    });
task("supportcandidate", "Support candidate price 0.01 ether")
    .addParam("account", "The account's private key")
    .addOptionalParam(
        "votingname",
        "votingname",
        "votingname",
        types.string
    )
    .addOptionalParam(
        "candidatename",
        "Candidate name",
        "candidatename",
        types.string
    )
    .setAction(async (supportcandidate) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = supportcandidate.account;
        const signer = new ethers.Wallet(key, provider);
        const VotingContract = new ethers.Contract(contractADR, DonatArtifact.abi, signer);

        const textSend = {
            value: ethers.utils.parseEther('0.01')
        }

        const SupportCandidate = await VotingContract.SupportCandidate(supportcandidate.votingname,supportcandidate.candidatename,textSend)
            .catch(error => {
                console.log(error.error.error.error.message);
                process.exit(1);
            });
        const reciept = await SupportCandidate.wait();
        console.log(`Successful Support:
            Voting name - ${reciept.events[0].args[0]}
            Candidate name - ${reciept.events[0].args[1]}
            `);
    });
task("getwinnerinform", "When the voting is in progress returns the data of the winning candidate. When the Voting is over returns the amount of the winnings")
    .addParam("account", "The account's private key")
    .addOptionalParam(
        "votingname",
        "votingname",
        "votingname",
        types.string
    )
    .setAction(async (getwinnerinform) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = getwinnerinform.account;
        const signer = new ethers.Wallet(key, provider);
        const VotingContract = new ethers.Contract(contractADR, DonatArtifact.abi, signer);

        const WinnerInformation = await VotingContract.getWinnerinform(getwinnerinform.votingname)

        console.log(`Successful Support:
            Winner - ${WinnerInformation[0]}
            Sumwin or Total support - ${WinnerInformation[1]}
            `);
    });
task("finishvote", "Ends voting")
    .addParam("account", "The account's private key")
    .addOptionalParam(
        "votingname",
        "votingname",
        "votingname",
        types.string
    )
    .setAction(async (finishvote) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = finishvote.account;
        const signer = new ethers.Wallet(key, provider);
        const VotingContract = new ethers.Contract(contractADR, DonatArtifact.abi, signer);

        

        const FinishVote = await VotingContract.finishVote(finishvote.votingname)
            .catch(error => {
                console.log(error.error.error.error.message);
                process.exit(1);
            });
        const reciept = await FinishVote.wait();
        console.log(`Successful Support:
            Winner - ${reciept.events[0].args[0]}
            Sumwin or Total support - ${ethers.utils.formatEther(reciept.events[0].args[1])}
                `);
    });
task("getcommissionbalance", "Return Commision Balance")
    .addParam("account", "The account's private key")
    .setAction(async (getcommissionbalance) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = getcommissionbalance.account;
        const signer = new ethers.Wallet(key, provider);
        const VotingContract = new ethers.Contract(contractADR, DonatArtifact.abi, signer)

        const commissionbalance = await VotingContract.GetcommissionBalance()

        console.log(`Successful Support:
            Winner - ${ethers.utils.formatEther(commissionbalance)}
            `)
        
    });
task("transfercommission", "transfer commision (only for owner)")
    .addParam("account", "The account's private key")
    .addParam("address", " account address to withdraw")
    .addParam("amount", " amount to wtihdraw (ether)")
    .setAction(async (getcommission) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`)
        const key = getcommission.account;
        const signer = new ethers.Wallet(key, provider);
        const VotingContract = new ethers.Contract(contractADR, DonatArtifact.abi, signer)

        const Sum = {
            value: ethers.utils.parseEther(getcommission.amount)
        }

        const Comission =await VotingContract.Transfercommission(getcommission.address, Sum.value)

        const reciept = await Comission.wait();

        console.log(`Successful Support:
            Withdraw address - ${reciept.events[0].args[0]}
            Withdrawn amount - ${ethers.utils.formatEther(reciept.events[0].args[1])}
                `);
    });