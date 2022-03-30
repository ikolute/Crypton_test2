//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";


contract CrowdFunding{
    address payable public owner;
    struct Projectinf{
        string name;
        address payable addr;
        uint amount;
        string information;
    }
    struct VotesN{
       string Votename;
       string Voteinfo;
       uint deadlineProjects;
       uint NumsProject;
       uint WiningprojectN;
       uint Winigprojectamount;
       uint TotalSuppot;
       mapping(address => bool) VoteNumber;
       address[] donators;
    }
    uint numCampaigns;
    uint Commission;
    mapping (uint => VotesN) public Votes;
    mapping (uint => mapping (uint => Projectinf)) private Projects;
    constructor(){
        owner = payable(msg.sender);
    }
    function NewVotes(string memory _name, string memory _Voteifo) public returns(uint campaignID) {
        require(msg.sender == owner, "you are not owner" );
        numCampaigns += 1;
        campaignID = numCampaigns;
        VotesN storage c = Votes[campaignID];
        c.Votename = _name;
        c.deadlineProjects = block.timestamp + 3 days;
        c.NumsProject = 0;
        c.Voteinfo = _Voteifo;
        c.WiningprojectN = 0;
        c.Winigprojectamount = 0;
        
    }
    function makeProject(uint _VoteNUM, string memory _Projectname, address payable _addr1, string memory _information ) public returns(uint project_id){
        require(msg.sender == owner, "you are not owner" );
        VotesN storage c = Votes[_VoteNUM];
        c.NumsProject +=1;
        project_id = c.NumsProject;
        Projectinf storage p = Projects[_VoteNUM][project_id];
        p.name = _Projectname;
        p.addr = _addr1;
        p.amount = 0;
        p.information = _information;
    }
    function supportProject(uint _VoteNum, uint _ProjectNUM) public payable{
        VotesN storage c = Votes[_VoteNum];
        require(c.VoteNumber[msg.sender] == false, "You already make vote in this Votes");
        c.VoteNumber[msg.sender] = true;
        require(msg.value == 0.01 ether, "need only 0.01 Ether");
        require(block.timestamp < c.deadlineProjects, "time end");
        Projectinf storage p = Projects[_VoteNum][_ProjectNUM];
        p.amount += msg.value;
        c.TotalSuppot += msg.value;
        if (p.amount > c.Winigprojectamount){
            c.Winigprojectamount = p.amount;
            c.WiningprojectN = _ProjectNUM;
        }
        
    }
    function GetVotesInformation(uint _VoteNUM) public view returns(string memory Votename , string memory Voteinfo, uint deadlineProjects, uint NumsProject, uint WiningprojectN,uint Winigprojectamount , uint Totalsupport){
        VotesN storage c = Votes[_VoteNUM];
        Votename = c.Votename;
        deadlineProjects = c.deadlineProjects ;
        NumsProject = c.NumsProject;
        Voteinfo = c.Voteinfo;
        WiningprojectN = c.WiningprojectN;
        Winigprojectamount = c.Winigprojectamount;
        Totalsupport = c.TotalSuppot;
        return (Votename , Voteinfo, deadlineProjects, NumsProject ,WiningprojectN ,Winigprojectamount,Totalsupport);
    }

    function GetProjectInformation(uint _VoteNUM, uint _Projectnum) public view returns( string memory _Projectname, string memory _information , uint amount){
        Projectinf storage p = Projects[_VoteNUM][_Projectnum];
        _Projectname = p.name;
        _information = p.information;
        amount = p.amount;
        return (_Projectname, _information , amount);
    }

    function GetProjectCount(uint _num) public view returns(uint ProjectsCount){
        VotesN storage c = Votes[_num];
        ProjectsCount = c.NumsProject;
        return ProjectsCount;
    }
    function GetVotesCount() public view returns(uint){
        return numCampaigns;
    }
    function Getcommission(address payable _reciver, uint amount) external {
        require(msg.sender == owner, "you are not owner" );
        require(Commission > amount, "not enough commission in Contract");
        _reciver.transfer(amount);
        Commission -= amount;
    }
    function GetcommissionBalance() public view returns(uint _Commission) {
        _Commission = Commission;
        return Commission;
    }
    function finishVote(uint _VoteNUM) external {
        VotesN storage c = Votes[_VoteNUM];
        require(block.timestamp > c.deadlineProjects, "try later");
        Projectinf storage p = Projects[_VoteNUM][c.WiningprojectN];
        p.addr.transfer(c.TotalSuppot*9/10);
        Commission = Commission + (c.TotalSuppot - c.TotalSuppot*9/10);
    }
    function getWinnerinform(uint _VoteNUM) public view returns(string memory Winner, uint Sumwin){
        VotesN storage c = Votes[_VoteNUM];
        require(block.timestamp > c.deadlineProjects, "try later");
        Projectinf storage p = Projects[_VoteNUM][c.WiningprojectN];
        Sumwin = c.TotalSuppot*9/10;
        Winner = p.name;
        return (Winner, Sumwin);


    }
}