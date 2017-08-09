const PixelToken     = artifacts.require('./PixelToken.sol');
const chai           = require('chai');
const {expect}       = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const Web3     = require('web3');
const provider = new Web3.providers.HttpProvider('http://localhost:8545')

const web3 = new Web3(provider);

contract('PixelToken', accounts => {
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
                return expect(contract.setContractOwner(creator, {from : creator})).to.be.rejected;
            }).then(() => {
                // return the owner back to the creator account
                return contract.setContractOwner(creator, {from : other});
            }).then(() => {
                // test to see if the new contract owner is indeed the original creator account
                return contract.getContractOwner.call({from : creator})
            }).then(owner => {
                expect(owner).to.equal(creator);
                // now the creator does not own the contract any more
                expect(owner).to.not.equal(other);
            })
        });
    })


    describe('Pixel transactions', () => {

        describe('claimPixel', () => {
            it('Should claim a pixel', () => {
                let contract; // the instantiated contract

                const pixelIndex = 0,
                      pixelColor = 0xFF0000FF, // red
                      pixelLink  = web3.fromAscii('awesomesite.com', 32), // convert a string to a bytes32
                      pixelCost  = web3.toWei(10, 'finney'); // pixel cost in wei

                return PixelToken.deployed().then(function (instance) {
                    contract = instance;
                    return contract.claimPixel(pixelIndex, pixelColor, pixelLink, {from : other, value : pixelCost});
                }).then(function () {
                    // check if the pixel indeed has a new owner
                    return contract.getPixelOwner.call(pixelIndex);
                }).then(owner => {
                    expect(owner).to.equal(other);
                }).then(() => {
                    // check if the color of the pixel is indeed set
                    return contract.getPixelColor.call(pixelIndex);
                }).then(color => {
                    // color is a BigNumber
                    expect(color.toNumber()).to.equal(pixelColor);
                }).then(() => {
                    // check if the link in the pixel is indeed set
                    return contract.getPixelLink.call(pixelIndex);
                }).then(link => {
                    // turn back into string
                    // @NOTE: we have to use `replace` because apparently web3.toAscii does not trim the null-characters at the end
                    const linkString = web3.toAscii(link).replace(/\0+$/, '');

                    expect(linkString).to.equal(web3.toAscii(pixelLink));

                    // @TODO: should probably check with
                })
            });

            it('Should be unable to claim a pixel with an index larger than _totalPixels', () => {
                let contract; // the instantiated contract
                const pixelIndex = 1000001; // pixel 1M and 1

                return PixelToken.deployed().then(function (instance) {
                    contract = instance;
                    expect(contract.claimPixel(pixelIndex, 0, 0, {from : other})).to.be.rejected;
                })
            });

            it('Should be unable to claim a pixel with an index smaller than 0', () => {
                let contract; // the instantiated contract
                const pixelIndex = -1; // pixel minus one

                return PixelToken.deployed().then(function (instance) {
                    contract = instance;
                    expect(contract.claimPixel(pixelIndex, 0, 0, {from : other})).to.be.rejected;
                })
            });

            it('should return a list of pixels', () => {
                let contract; // the instantiated contract

                return PixelToken.deployed().then(function (instance) {
                    contract = instance;
                    console.log('contract', contract);
                    return contract.pixels.call({from: other});
                }).then(pixels => {
                    console.log('pixels', pixels);
                })
            })
        })
    })
});
