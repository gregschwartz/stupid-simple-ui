// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Faucet {
  address payable public owner;

  constructor() payable {
    owner = payable(msg.sender);
  }

  function balance() public view returns(uint) {
    return address(this).balance;
  }
  
  function withdraw(uint _amount) payable public {
    // users can only withdraw .1 ETH at a time, feel free to change this!
    require(_amount <= 100000000000000000, "Amount must be 0.1 ETH or less");
    (bool sent, ) = payable(msg.sender).call{value: _amount}("");
    require(sent, "Failed to send Ether");
  }

  function withdrawAll() onlyOwner public {
    (bool sent, ) = owner.call{value: address(this).balance}("");
    require(sent, "Failed to send Ether");
  }

  function destroyFaucet() onlyOwner public {
    selfdestruct(owner);
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
}