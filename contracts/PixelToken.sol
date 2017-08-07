pragma solidity ^0.4.2;

/*

pixel token contract

*/
contract PixelToken {
    // creator of the contract
    address owner;

    function setOwner(address _owner) {
        owner = _owner;
    }

    function getOwner() constant returns (address) {
        return owner;
    }
}
