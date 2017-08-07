var PixelToken = artifacts.require("./PixelToken.sol");

contract('PixelToken', function(accounts) {

  it("...should store the value 89.", function() {
    return PixelToken.deployed().then(function(instance) {
        PixelToken = instance;

      return PixelToken.set(89, {from: accounts[0]});
    }).then(function() {
      return PixelToken.get.call();
    }).then(function(storedData) {
      assert.equal(storedData, 89, "The value 89 was not stored.");
    });
  });

});
