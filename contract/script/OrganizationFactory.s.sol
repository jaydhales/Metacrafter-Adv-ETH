// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/OrgFactory.sol";
import "../src/JayToken.sol";

import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract MyScript is Script {
    function run() external {
        OrganizationFactory orgFactory = new OrganizationFactory();
        JayToken jayToken = new JayToken();

        console2.logAddress(address(orgFactory));
        console2.logAddress(address(jayToken));
    }
}
