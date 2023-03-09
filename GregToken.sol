//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//deployed to 0x04f5FBcCfC5C5ca62C84Cc5Bb71bD99a6cA43874
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GregToken is ERC20 {
    uint constant _initial_supply = 100 * (10**18);

    constructor() ERC20("GregToken", "GGG") {
        _mint(msg.sender, _initial_supply);
    }
}