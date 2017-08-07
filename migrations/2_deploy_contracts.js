var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var PixelToken    = artifacts.require("./PixelToken.sol");

module.exports = function (deployer) {
    deployer.deploy(SimpleStorage);
    deployer.deploy(PixelToken);
};
