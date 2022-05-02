//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract VotingContract {
    address payable public owner; // owner's address
    uint Commission; // stores total amount of commision
    // 
    struct VotingInformation{
        string VotingComment; // short information about Voting

        string WiningCandidateName; 

        uint WiningCandidateamount; 

        uint VotingDeadline; // time when the voting ends

        uint256 TotalSupportSum; //  stores total amount of Voting

        uint TotalCandidates;

        mapping(string => uint)  CandidateIndex; // to index candidates
        
        string[] CandidatesNames; // array of Candidates of 1 Voting

        string[] CandidatesInformation; // array of information about Candidates

        address[]  CandidatesAddressesToWithdraw; // array of information about Candidates addresses

        uint256[] CandidatesSupportSum; // array of information about Candidates Support amount

        mapping(address => bool) DonatorStatus; // to checking Donator status (donate or not)
    }
    string[] All_Voting; // all voting
    mapping(string => VotingInformation) public Voting_Name_Information; // Name of Voting - mapping - VotingInformation

    mapping(string => bool) public VotingStatus; //to  checking Voting status (running or finished)
    
    event SubmitCreatevoting(string _VotingName , string _VotingInfom);
    event SubmitCreateCandidate(string _VotingName , string _Candidatetname, string _CandidateInform, address _Candidate_addr);
    event SubmitSupportCandidate(string _VotingName , string _Candidatetname);
    event SubmitFinishVoting(string _VotingName, uint _SumWin);
    event SubmitTransferComission(address payable _addr, uint amount);
    constructor() {
        owner = payable(msg.sender);
    }

    // to check that the owner is calling the function
    modifier Only_owmer {
      require(msg.sender == owner, "you are not owner");
      _;
    }
    // to check Voting Status
    modifier StatusCheck (string memory _VotingName) {
      require(VotingStatus[_VotingName] == true, "Voting already finished");
      _;
    }
    function CreateVoting(string memory _VotingName, string memory _VotingInfo)
        public Only_owmer
    {   
        VotingStatus[_VotingName] = true; // set Status 
        VotingInformation storage V = Voting_Name_Information[_VotingName];
        All_Voting.push(_VotingName);
        V.VotingComment = _VotingInfo;
        V.VotingDeadline = block.timestamp + 3 days;
        V.TotalCandidates = 0;
        emit SubmitCreatevoting(_VotingName, _VotingInfo);
    }
    function CreateCandidate(string memory _VotingName, string memory _Candidatetname, string memory _information, address payable _addr)
        public Only_owmer
    {   
        // fill in information about candidates
        VotingInformation storage V = Voting_Name_Information[_VotingName];
        V.CandidatesNames.push(_Candidatetname);
        V.CandidatesAddressesToWithdraw.push(_addr);
        V.CandidatesInformation.push(_information);
        V.CandidatesSupportSum.push(0);
        V.CandidateIndex[_Candidatetname] = V.TotalCandidates;
        V.TotalCandidates +=1;
        emit SubmitCreateCandidate(_VotingName , _Candidatetname, _information, _addr);
    }
    function GetAllVotings() 
        public view
        returns (string[] memory)
    {
        return (All_Voting);
    }
    function GetInformationAboutVoting(string memory _VotingName)
        public view
        returns (string[] memory _CandidatesName, string[] memory _CandidatesInformation, uint[] memory _SupportAmount , uint deadline)
    {   
        VotingInformation storage V = Voting_Name_Information[_VotingName];
        _CandidatesName = V.CandidatesNames;
        _CandidatesInformation = V.CandidatesInformation;
        _SupportAmount = V.CandidatesSupportSum;
        deadline = V.VotingDeadline;
        return(_CandidatesName,_CandidatesInformation, _SupportAmount, deadline);
    }
    function SupportCandidate(string memory _VotingName, string memory _CandidateName)
        public 
        payable
    {
        VotingInformation storage V = Voting_Name_Information[_VotingName];
        uint Index = V.CandidateIndex[_CandidateName];
        require(
            V.DonatorStatus[msg.sender] == false,
            "You already support Candidate in this Voting"
        );
        V.DonatorStatus[msg.sender] = true;
        require(msg.value == 0.01 ether, "need only 0.01 Ether");
        require(block.timestamp < V.VotingDeadline, "time end");
        V.CandidatesSupportSum[Index] += msg.value;
        V.TotalSupportSum += msg.value;

        if (V.CandidatesSupportSum[Index] > V.WiningCandidateamount) {
            V.WiningCandidateamount = V.CandidatesSupportSum[Index];
            V.WiningCandidateName = _CandidateName;
        }
        
        emit SubmitSupportCandidate(_VotingName,_CandidateName);

    }
    function Transfercommission(address payable _addr, uint256 amount) 
    external Only_owmer
    {
        require(Commission > amount, "not enough commission in Contract");
        _addr.transfer(amount);
        Commission -= amount;
        emit SubmitTransferComission(_addr, amount);
    }
    function GetcommissionBalance() 
        public view
        returns (uint256 _Commission) 
    {
        _Commission = Commission;
        return _Commission;
    }
    function finishVote(string memory _VotingName) 
        external
        StatusCheck(_VotingName)
    {
        VotingInformation storage V = Voting_Name_Information[_VotingName];
        VotingStatus[_VotingName] = false; // set Voting Status
        require(block.timestamp > V.VotingDeadline, "try later");
        uint Index = V.CandidateIndex[V.WiningCandidateName];
        address payable addr = payable(V.CandidatesAddressesToWithdraw[Index]);
        addr.transfer((V.TotalSupportSum * 9) / 10);
        Commission = Commission + (V.TotalSupportSum - (V.TotalSupportSum * 9) / 10);
        V.TotalSupportSum = ( V.TotalSupportSum * 9) / 10;
        emit SubmitFinishVoting(_VotingName,V.TotalSupportSum);
    }
    // When the voting is in progress returns the data of the winning candidate
    // when the Voting is over returns the amount of the winnings
    function getWinnerinform(string memory _VotingName)
        public
        view
        returns (string memory Winner, uint256 Sumwin)
    {
        VotingInformation storage V = Voting_Name_Information[_VotingName];
        Winner = V.WiningCandidateName;
        Sumwin = V.TotalSupportSum;
        return (Winner, Sumwin);
    }
}