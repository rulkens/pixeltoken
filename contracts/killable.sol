pragma solidity ^0.4.11;

import "./owned.sol";

contract killable is owned {

    // kill switch, not sure if we should use this
    function kill() onlyContractOwner {
        selfdestruct(contractOwner);
    }
}