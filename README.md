Description:

The smart contract is designed to create voting with a list of candidates, with the ability of other users to choose the winner. To participate in the voting, you need to deposit 0.01 ETH. The winner of the vote takes the entire amount collected minus the commission.


hardhat tasks: 

1)You can create new vote (only for owner) 

`npx hardhat createvoting --account private_key -votingname "Name of Voting" --comment "Some information" --network rinkeby`

2)You can create new candidate in vote (only for owner)

`npx hardhat createcandidate --account private_key  --accountwith "address to withdraw winning sum" -votingname "Name of Voting" -candidatename "Name of Candidate" --comment "some information about project" --network rinkeby`

3)You can support project (price 0.01 ether)

`npx hardhat supportcandidate --account private_key  --votingname "Name of Voting" -candidatename "Name of Candidate" --network rinkeby`

4)You can get information what votes are there

`npx hardhat getvotings --account private_key  --network rinkeby`

5)You can get information about Candidates

`npx hardhat getinformationaboutvoting --account private_key --votingname "Name of Voting" --network rinkeby  `

6)You can finish vote (after 3 days of project start)

`npx hardhat finishvote --account private_key  --votingname "Name of Voting"  --network rinkeby`

7)You can get information about winner

`npx hardhat getwinnerinform --account private_key  --votingname "Name of Voting"  --network rinkeby`

8)You can get comission balance

`npx hardhat getcommissionbalance --account private_key  --network rinkeby`

9)You can transfer commision (only for owner)

`npx hardhat transfercommission --account private_key --address "address to withdraw winning sum" --amount "amount to withdraw (ether)" --network rinkeby`






FAQ;


About Safemath 

"In a recent update of Solidity the Integer type variables cannot overflow anymore. Read more about the following Solidity 0.8 release notes!.
Add the following code only if you are using solidity < 0.8!!!"

(https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol)

(https://docs.soliditylang.org/en/v0.8.3/080-breaking-changes.html)

Возможно safemath, нужен был когда была версия soldity 0.5.0 (в прошлой заявке)



About revertedWith 

Работает верно, исправил с помощью (https://github.com/TrueFiEng/Waffle/pull/627/commits/1b9411697daba22464e63b1a3f740a7f51dd32f2)

About soldity:

If i take version 0.8.10 i get an warning:

Solidity 0.8.10 is not fully supported yet. You can still use Hardhat, but some features, like stack traces, might not work correctly.

