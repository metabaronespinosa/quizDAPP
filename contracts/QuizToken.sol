// contracts/Quiz.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract QuizToken is ERC20 {
    address public tokenOwner;
    uint256 private rewardPerAnswer = 1;
    mapping(address => uint256) public userLastClaim;
    mapping(uint256 => uint256[]) private quizzesResponses;

    constructor(uint256 initialSupply) ERC20("QuizToken", "QUIZ") {
        _mint(msg.sender, initialSupply);

        tokenOwner = msg.sender;
    }

    function submitForm(uint256 quizId, uint256[] memory responses) public {
        require(userLastClaim[msg.sender] > 1 days);

        uint256 quizLength = quizzesResponses[quizId].length;
        uint256 claimable = 0;

        for (uint256 i = 0; i < quizLength; i++) {
            if (responses[i] == quizzesResponses[quizId][i]) {
                claimable = claimable + rewardPerAnswer;
            }
        }

        transfer(msg.sender, (claimable * 10) ^ 18);
    }
}
