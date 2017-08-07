pragma solidity ^0.4.11;


contract owned {

    address public contractOwner;

    function owned() {
        contractOwner = msg.sender;
    }

    // This contract only defines a modifier but does not use
    // it - it will be used in derived contracts.
    // The function body is inserted where the special symbol
    // "_;" in the definition of a modifier appears.
    // This means that if the owner calls this function, the
    // function is executed and otherwise, an exception is
    // thrown.
    modifier onlyContractOwner {
        require(msg.sender == contractOwner);
        _;
    }

    // set a new contract owner
    // @TODO: transfer all the current balances to the new owner
    function setContractOwner(address _contractOwner) onlyContractOwner returns (bool) {
        contractOwner = _contractOwner;
        return true;
    }

    function getContractOwner() constant returns (address) {
        return contractOwner;
    }

    // withdraw some of the ether stored in the contract
    function withdraw(uint256 _amount) onlyContractOwner returns (bool) {
        // we should probably check if the amount requested to withdraw is less than the amount in the contract
        msg.sender.transfer(_amount);
    }
}
