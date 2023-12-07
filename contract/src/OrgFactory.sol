// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "./Organization.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract OrganizationFactory {
    mapping(address owner => Organization[]) organizations;
    mapping(address owner => mapping(Organization => bool)) public isOwner;
    mapping(address user => Organization[]) userOrganizations;
    mapping(address user => mapping(Organization => bool)) public isUser;

    modifier onlyOwner(Organization _org) {
        require(isOwner[msg.sender][_org], "Organization: Only owner");
        _;
    }

    function createOrganization(string memory _name, IERC20 _vestingToken, uint256 _vestedAmount) public {
        (bool success) = _vestingToken.transferFrom(msg.sender, address(this), _vestedAmount);
        require(success, "Organization: Failed to transfer vesting token");

        Organization newOrg = new Organization(_name, _vestingToken, _vestedAmount);
        (bool success2) = _vestingToken.transfer(address(newOrg), _vestedAmount);

        require(success2, "Organization: Failed to transfer vesting token to organization");

        isOwner[msg.sender][newOrg] = true;
        organizations[msg.sender].push(newOrg);
    }

    function setRole(Organization _org, Organization.Role _role, uint256 vestingPeriod, uint256 rewardRatio)
        public
        onlyOwner(_org)
    {
        _org.setRoleReward(_role, Organization.RoleReward(vestingPeriod, rewardRatio));
    }

    function setStakeHolder(Organization _org, address _stakeHolder, Organization.Role _role) public onlyOwner(_org) {
        require(isUser[_stakeHolder][_org] == false, "Organization: Stakeholder already set");
        _org.setStakeHolder(_stakeHolder, _role);
        isUser[_stakeHolder][_org] = true;
        userOrganizations[_stakeHolder].push(_org);
    }

    function activateVesting(Organization _org) public onlyOwner(_org) {
        _org.activateVesting();
    }

    function claimVested(Organization _org) public {
        _org.claimTokens();
    }

    function getStakeHolder(Organization _org, address _stakeHolder)
        public
        view
        returns (string memory _role, uint256 _vestingPeriod, uint256 _rewardRatio, uint256 _claims)
    {
        (_role, _vestingPeriod, _rewardRatio, _claims) = _org.getStakeHolder(_stakeHolder);
    }

    function getOwnerOrganizations(address _owner) public view returns (Organization[] memory) {
        return organizations[_owner];
    }

    function getUserOrganizations(address _user) public view returns (Organization[] memory) {
        return userOrganizations[_user];
    }

    function getAllRoles(Organization _org) public pure returns (string[4] memory _role) {
        _role = _org.getAllRoles();
    }
}
