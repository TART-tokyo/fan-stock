// SPDX-License-Identifier: GPL-3.0
/*
 *     Copyright (C) 2021 TART K.K.
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see https://www.gnu.org/licenses/.
 */
pragma solidity =0.6.11;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../SafeMath32.sol";

contract DistributorInterfaceV1 {
    using SafeMath for uint256;
    using SafeMath32 for uint32;

    event CreateCampaign(
        uint256 indexed campaignId,
        address indexed token,
        address indexed creator
    );

    event Claim(
        address indexed from,
        address indexed to
    );

    struct Campaign {
        address campaignToken;
        uint256 claimAmount;
        uint32 claimedNum;
        string merkleTreeCid;
    }

    constructor(string memory _distributorInfoCid) public {
        distributorInfoCid = _distributorInfoCid;
    }

    string public distributorInfoCid;
    // TODO: Add features updatable or whitelist
    uint256 public nextCampaignId = 1;
    uint32 public claimedNum = 0;
    mapping(uint256 => string) public merkleTreeCidMap;

    function calculateClaimAmount(
        uint256 amount,
        uint32 recipientsNum
    ) internal pure returns (uint256) {
        return amount.div(uint256(recipientsNum));
    }

    function createCampaign(
        bytes32 merkleRoot,
        address payable token,
        string memory merkleTreeCid
    ) virtual external {}

    function transferToken(
        address token,
        address from,
        address to
    ) internal {
        ERC20 erc20 = ERC20(token);
        uint256 amount = erc20.allowance(from, address(this));
        erc20.transferFrom(from, to, amount);
    }

    // Future functionality
    // function updateTokenHolder(address newTokenHolder) external; // onlyOwner
}
