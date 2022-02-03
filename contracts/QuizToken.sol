// contracts/Quiz.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract QuizToken is ERC20, Ownable {
    address public tokenOwner;
    uint256 private rewardPerCorrectAnswer = 1;
    mapping(address => uint256) public userLastClaim;
    mapping(string => string[]) private quizAnswers;

    event QuizResult(address indexed _from, uint256 _reward);

    // In case we want to restrict Quizzes resolution just once
    // mapping(address => string[]) private userQuizzesResolved;

    constructor(
        uint256 initialSupply,
        string memory sampleQuizId,
        string[] memory sampleQuizAnswers
    ) ERC20("QuizToken", "QUIZ") {
        _mint(msg.sender, initialSupply * 10**decimals());

        quizAnswers[sampleQuizId] = sampleQuizAnswers;

        tokenOwner = msg.sender;
    }

    function submitQuiz(string memory quizId, string[] memory answers) public returns (bool) {
        // Claim can be limited to minutes, hours or even days...
        require(
            userLastClaim[msg.sender] == 0 || userLastClaim[msg.sender] + 1 minutes < block.timestamp - 1 minutes,
            "Claim only available once every 1 minutes."
        );

        uint256 quizLength = quizAnswers[quizId].length;
        uint256 claimable = 0;

        for (uint256 i = 0; i < quizLength; i++) {
            if (keccak256(abi.encodePacked(answers[i])) == keccak256(abi.encodePacked(quizAnswers[quizId][i]))) {
                claimable = claimable + rewardPerCorrectAnswer;
            }
        }

        if (claimable > 0) {
            _mint(msg.sender, claimable * 10**decimals());

            userLastClaim[msg.sender] = block.timestamp;
        }

        emit QuizResult(msg.sender, claimable);

        return true;
    }

    function setRewardPerCorrectAnswer(uint256 amount) public onlyOwner {
        rewardPerCorrectAnswer = amount;
    }

    function createNewQuiz(string memory quizId, string[] memory correctAnswers) public onlyOwner {
        quizAnswers[quizId] = correctAnswers;
    }

    function getQuizAnswers(string memory quizId) public view onlyOwner returns (string[] memory anwsers) {
        return quizAnswers[quizId];
    }
}
