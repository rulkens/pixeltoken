pragma solidity ^0.4.11;

contract SimpleStorage {
  uint storedData = 18;

  function set(uint x) {
    storedData = x;
  }

  function get() constant returns (uint) {
    return storedData;
  }
}
