// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DistributorInterfaceV2 {
    using SafeMath for uint256;

    event CreateCampaign(
        address indexed campaign,
        address indexed token,
        address indexed creator
    );

    constructor(string memory _distributorInfoCid) public {
        distributorInfoCid = _distributorInfoCid;
    }

    string public distributorInfoCid;
    // TODO: Add features updatable or whitelist
    uint256 public nextCampaignId = 1;
    mapping(uint256 => address) public campaignList;

    function getAllowanceOf(address token, address owner) internal view returns (uint256) {
        ERC20 erc20 = ERC20(token);
        return erc20.allowance(owner, address(this));
    }

    function calculateClaimAmount(
        uint256 amount,
        uint32 recipientsNum
    ) internal pure returns (uint256) {
        return amount.div(uint256(recipientsNum));
    }

    function createCampaign(
        bytes32 merkleRoot,
        address payable token,
        address tokenHolder, // Not only TokenHolder contract address but include creator address
        string memory campaignInfoCid,
        string memory recipientsCid,
        uint32 recipientsNum,
        uint256 startDate,
        uint256 endDate
    ) virtual external {}

    function transferToken(
        address token,
        address from,
        address to,
        uint256 amount
    ) internal {
        ERC20 erc20 = ERC20(token);
        erc20.transferFrom(from, to, amount);
    }

    // Future functionality
    // function updateTokenHolder(address newTokenHolder) external; // onlyOwner
}
