// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

contract GregGuestBook {
    event NewEntryAdded(string message);

    constructor() {
        entries.push("The genesis post");
    }

    string[] public entries;

    function addEntry(string memory _message) public {
        entries.push(_message);
        emit NewEntryAdded(_message);
    }

    function getEntries() public view returns (string[] memory) {
        return entries;
    }
}
