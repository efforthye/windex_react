const stakingNFT = artifacts.require('StakingNFT.sol');
module.exports = (deployer) => {
    deployer.deploy(
        stakingNFT,
        '0x521049eD910dEDa56aE8E93F1BE93338B61897a3',
        '0xfb618a472Fbf9863f14D3833EAa02eF8215c5Dbb'
    );
};
