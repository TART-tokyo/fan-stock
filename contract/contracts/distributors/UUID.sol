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

import "@iroiro/merkle-distributor/contracts/StringMerkleDistributor.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../interfaces/CampaignInterfaceV1.sol";
import "../interfaces/DistributorInterfaceV1.sol";
import "../SafeMath32.sol";

contract UUIDDistributor is DistributorInterfaceV1 {
    constructor (string memory _distributorInfoCid) public
    DistributorInterfaceV1(_distributorInfoCid) {}

    function createCampaign(
        bytes32 merkleRoot,
        address payable token,
        string memory merkleTreeCid,
        uint256 claimAmount
    ) external override {
        UUIDCampaign campaign = new UUIDCampaign(
            merkleRoot,
            token,
            merkleTreeCid,
            claimAmount
        );
        campaignList[nextCampaignId] = address(campaign);
        nextCampaignId = nextCampaignId.add(1);
        transferToken(token, msg.sender, address(campaign));

        emit CreateCampaign(
            address(campaign),
            token,
            msg.sender
        );
    }
}

contract UUIDCampaign is CampaignInterfaceV1, StringMerkleDistributor {
    using SafeMath32 for uint32;

    string public merkleTreeCid;

    constructor(
        bytes32 merkleRoot,
        address payable _campaignToken,
        string memory _merkleTreeCid,
        uint256 _claimAmount
    ) public
    CampaignInterfaceV1(
        _campaignToken,
        _claimAmount
    )
    StringMerkleDistributor(_campaignToken, merkleRoot)
    {
        merkleTreeCid = _merkleTreeCid;
    }

    function claim(
        uint256 index,
        string memory hashed,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) public override {
        claimedNum = claimedNum.add(1);
        super.claim(index, hashed, amount, merkleProof);

        emit Claim(msg.sender, msg.sender);
    }
}
