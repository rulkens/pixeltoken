pragma solidity ^0.4.2;

contract SimpleStorage {
  uint storedData = 18;

  function set(uint x) {
    storedData = x;
  }

  function get() constant returns (uint) {
    return storedData;
  }
}
