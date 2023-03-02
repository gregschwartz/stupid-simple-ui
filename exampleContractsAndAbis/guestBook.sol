// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract GuestBook {
    struct Entry {
        string message;
        address sender;
        uint256 timestamp;
    }

    event NewEntryAdded(string message, address sender, uint256 timestamp);

    constructor() {
        entries.push(Entry("The genesis post", msg.sender, block.timestamp));
    }

    Entry[] public entries;

    function addEntry(string memory _message) public {
        entries.push(Entry(_message, msg.sender, block.timestamp));
        emit NewEntryAdded(_message, msg.sender, block.timestamp);
    }

    function getEntries() public view returns (Entry[] memory) {
        return entries;
    }
}
