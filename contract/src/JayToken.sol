// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract JayToken is ERC20, Ownable {
    constructor() ERC20("Jay Token", "JYT") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * (10 ** decimals()));
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
