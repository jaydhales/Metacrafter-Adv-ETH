// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Organization is Ownable {
    enum Role {
        Community,
        Investors,
        Founders,
        Developers
    }

    struct RoleReward {
        uint256 vestingPeriod;
        uint256 rewardRatio;
    }

    string name;
    bool public isVestActive;
    uint256 vestingStartTime;
    uint256 totalRewardRatio;
    uint256 vestedAmount;

    mapping(address => Role) public stakeHolders;
    mapping(Role => RoleReward) public roles;

    mapping(address => bool) public isStakeHolder;

    IERC20 public immutable vestingToken;

    constructor(string memory _name, IERC20 _vestingToken, uint256 _vestedAmount) Ownable(msg.sender) {
        require(
            _vestingToken.balanceOf(msg.sender) >= _vestedAmount,
            "Organization: Factory must have correct amount of vesting token"
        );
        name = _name;
        vestingToken = _vestingToken;
        vestedAmount = _vestedAmount;
    }

    modifier onlyBeforeVestActive() {
        require(isVestActive == false, "Organization: Vesting active");
        _;
    }

    function setRoleReward(Role _role, RoleReward memory _roleReward) public onlyOwner onlyBeforeVestActive {
        RoleReward storage initRole = roles[_role];
        require(initRole.rewardRatio == 0 && initRole.vestingPeriod == 0, "Organization: Role reward already set");
        require(_roleReward.vestingPeriod > 0, "Organization: Invalid vesting period");
        require(_roleReward.rewardRatio > 0, "Organization: Invalid reward ratio");

        roles[_role] = _roleReward;
    }

    function setStakeHolder(address _stakeHolder, Role _role) public onlyOwner onlyBeforeVestActive {
        require(isStakeHolder[_stakeHolder] == false, "Organization: Stakeholder already set");

        isStakeHolder[_stakeHolder] = true;
        stakeHolders[_stakeHolder] = _role;
        totalRewardRatio += roles[_role].rewardRatio;
    }

    function activateVesting() public onlyOwner onlyBeforeVestActive {
        uint256 tokenBalance = vestingToken.balanceOf(address(this));
        require(tokenBalance >= vestedAmount, "Organization: Contract balance must not be less than Vested amount");
        vestedAmount = tokenBalance;
        isVestActive = true;
        vestingStartTime = block.timestamp;
    }

    function claimTokens() public onlyOwner {
        require(isVestActive == true, "Organization: Vesting not active");
        address claimant = tx.origin;
        require(isStakeHolder[claimant], "Organization: User can't claim rewards");
        Role _role = stakeHolders[claimant];
        RoleReward storage _rewardS = roles[_role];
        require(block.timestamp >= vestingStartTime + _rewardS.vestingPeriod, "Organization: Vesting not mature");
        uint256 tokenToClaim = calculateReward(_rewardS.rewardRatio);

        isStakeHolder[claimant] = true;
        (bool success) = vestingToken.transfer(claimant, tokenToClaim);
        require(success, "Organization: Claiming failed");
    }

    function getStakeHolder(address _stakeHolder)
        public
        view
        returns (string memory _role, uint256 _vestingPeriod, uint256 _rewardRatio, uint256 _claims)
    {
        require(isStakeHolder[_stakeHolder], "Not a StakeHolder");
        Role _r = stakeHolders[_stakeHolder];
        _role = _getRole(_r);
        RoleReward memory _re = roles[_r];
        _vestingPeriod = _re.vestingPeriod;
        _rewardRatio = _re.rewardRatio;
        _claims = calculateReward(_rewardRatio);
    }

    function _getRole(Role _role) public pure returns (string memory _r) {
        if (_role == Role.Community) {
            _r = "Community";
        } else if (_role == Role.Investors) {
            _r = "Investors";
        } else if (_role == Role.Founders) {
            _r = "Founders";
        } else {
            _r = "Developers";
        }
    }

    function getAllRoles() public pure returns (string[4] memory _role) {
        _role = [_getRole(Role.Community), _getRole(Role.Investors), _getRole(Role.Founders), _getRole(Role.Developers)];
    }

    function calculateReward(uint256 _ratio) public view returns (uint256 _amountToClaim) {
        _amountToClaim = (_ratio * vestedAmount) / totalRewardRatio;
    }
}
