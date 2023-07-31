const vendor = artifacts.require('Vendor.sol');
module.exports = (deployer) => {
    deployer.deploy(vendor, '0x521049eD910dEDa56aE8E93F1BE93338B61897a3');
};
