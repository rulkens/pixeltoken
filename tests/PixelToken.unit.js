const PixelToken = artifacts.require("./PixelToken.sol");
const {expect}   = require('chai');

contract('PixelToken', (accounts) => {
    // save the accounts with an easier name
    // accounts[0] is always the account that created the contract.
    const creator = accounts[0],
          other   = accounts[1];

    describe('Initialization', () => {
        it("Should set the contractOwner variable to the person deploying the contract", () => {
            return PixelToken.deployed().then(instance => {
                return instance.getContractOwner.call({from : creator});
            }).then(owner => {
                expect(owner).to.equal(creator);
                expect(owner).to.not.equal(other);
            });
        });

        it("Should set the contractOwner to `other` when we call `setContractOwner` from the creator's address", () => {
            let contract;
            return PixelToken.deployed().then(instance => {
                contract = instance;
                return contract.setContractOwner(other, {from : creator})
            }).then(() => {
                // test to see if the new contract owner is indeed the second account
                return contract.getContractOwner.call({from : creator})
            }).then(owner => {
                expect(owner).to.equal(other);
                // now the creator does not own the contract any more
                expect(owner).to.not.equal(creator);
            }).then(() => {
                // the owner is now the `other` account
                // now, try to set the owner from our `creator` account, which should fail
                return contract.setContractOwner(creator, {from: creator})
            }).then(() => {
                // ai, it should fail
            })
        });
    })

    /*
    it("Should claim a pixel", function () {
        return PixelToken.deployed().then(function (instance) {
            pixelTokenInstance = instance;

            return pixelTokenInstance.claimPixel(0, 0xFF0000FF, 0x344535);
        }).then(function (success) {
            assert.equal(success, true, "The pixel was not claimed.");
        });
    });
    */

});
