//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import '../contracts/HutToken.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';
import '../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract CrowdSale is ReentrancyGuard, Ownable {
    address payable public beneficiary;
    uint public fundingGoal;
    uint public amountRaised;
    uint public deadline;
    uint public price;
    HutToken public tokenReward;

    event FundTransfer(address backer, uint amount, bool isContribution);
    event GoalReached(uint amountRaised);
    event Refund(address investor, uint value);
    event TokenRewardSent(address investor, uint amount);

    struct Funder {
        address payable addr;
        uint amount;
    }

    Funder[] public funders;

    constructor(address payable _beneficiary, uint _fundingGoal, uint _duration, uint _price, address _reward) {
        require(_beneficiary != address(0), 'Invalid beneficiary address');
        require(_fundingGoal > 0, 'Invalid funding goal');
        require(_duration > 0, 'Invalid duration');
        require(_price > 0, 'Invalid price');
        require(_reward != address(0), 'Invalid token reward address');

        beneficiary = _beneficiary;
        fundingGoal = _fundingGoal;
        deadline = block.timestamp + (_duration * 1 minutes);
        price = _price;
        tokenReward = HutToken(_reward);
    }

    receive() external payable nonReentrant {
        require(msg.sender != address(0), 'Invalid sender address');
        require(msg.value > 0, 'Invalid value');
        require(block.timestamp <= deadline, 'already expired');
        uint amount = msg.value;
        funders.push(Funder({ addr: payable(msg.sender), amount: amount }));
        amountRaised += amount;
    }

    function checkBlockTime() external view returns (uint256) {
        return block.timestamp;
    }

    function getFundingGoal() external view returns (uint256) {
        return fundingGoal;
    }

    function getNowAmountRaised() external view returns (uint256) {
        return amountRaised;
    }

    function getDeadLine() external view returns (uint256) {
        return deadline;
    }

    function getHutToken() external view returns (uint tokenAmount) {
        return tokenReward.balanceOf(address(this));
    }

    function checkGoalReached() external onlyOwner {
        require(block.timestamp >= deadline, 'Crowdsale not yet ended');
        if (amountRaised >= fundingGoal) {
            uint256 amount = amountRaised;
            amountRaised = 0;
            beneficiary.transfer(amount);
            emit FundTransfer(beneficiary, amount, false);
            emit GoalReached(amount);
            for (uint256 i = 0; i < funders.length; i++) {
                Funder storage funder = funders[i];
                uint256 rewardAmount = funder.amount * price;
                tokenReward.transfer(funder.addr, rewardAmount);
                emit TokenRewardSent(funder.addr, rewardAmount);
            }
        } else {
            for (uint256 i = 0; i < funders.length; i++) {
                Funder storage funder = funders[i];
                uint256 amount = funder.amount;
                funder.amount = 0;

                if (amount > 0) {
                    funder.addr.transfer(amount);
                    emit Refund(funder.addr, amount);
                    emit FundTransfer(funder.addr, amount, false);
                }
            }
        }
    }

    function getFundersCount() external view returns (uint256) {
        return funders.length;
    }
}
