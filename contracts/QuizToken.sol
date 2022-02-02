// contracts/Quiz.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract QuizToken is ERC20, Ownable {
    address public tokenOwner;
    uint256 private rewardPerCorrectAnswer = 1;
    mapping(address => uint256) public userLastClaim;
    mapping(uint256 => uint256[]) private quizzesAnswers;

    constructor(uint256 initialSupply) ERC20("QuizToken", "QUIZ") {
        _mint(msg.sender, initialSupply * 10**decimals());

        tokenOwner = msg.sender;
    }

    function submitForm(uint256 quizId, uint256[] memory responses) public {
        require(userLastClaim[msg.sender] > 1 days, "Only one claim every 24 hours.");

        uint256 quizLength = quizzesAnswers[quizId].length;
        uint256 claimable = 0;

        for (uint256 i = 0; i < quizLength; i++) {
            if (responses[i] == quizzesAnswers[quizId][i]) {
                claimable = claimable + rewardPerCorrectAnswer;
            }
        }

        transfer(msg.sender, claimable * 10**decimals());
    }

    function setRewardPerCorrectAnswer(uint256 amount) public onlyOwner {
        rewardPerCorrectAnswer = amount;
    }

    function createNewQuiz(uint256 quizId, uint256[] memory correctAnswers) public onlyOwner {
        quizzesAnswers[quizId] = correctAnswers;
    }
}
