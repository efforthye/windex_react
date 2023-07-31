const crowdSale = artifacts.require('CrowdSale.sol');
module.exports = (deployer) => {
    deployer.deploy(
        crowdSale,
        '0x68776746d0d9F615b3ED0DFA970C73c45458A4A3',
        '20000000000000000000',
        60,
        10,
        '0x521049eD910dEDa56aE8E93F1BE93338B61897a3'
    );
    // address payable _beneficiary, uint _fundingGoal, uint _duration, uint _price, address _reward
};
