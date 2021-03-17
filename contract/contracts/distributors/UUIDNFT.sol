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

pragma solidity =0.7.6;

import "@iroiro/merkle-distributor/contracts/StringMerkleTreeManager.sol";
import "../interfaces/NFTDistributorInterfaceV1.sol";

contract UUIDNFTDistributor is NFTDistributorInterfaceV1, StringMerkleTreeManager {
    constructor (string memory _distributorInfoCid, string memory uri)
    NFTDistributorInterfaceV1(_distributorInfoCid, uri) {}

    function createCampaign(
        bytes32 merkleRoot,
        string memory merkleTreeCid,
        string memory campaignInfoCid,
        string memory nftMetadataCid,
        uint32 amount // nft mint cap
    ) external override {
        emit CreateCampaign(
            nextTreeId,
            msg.sender,
            merkleTreeCid,
            campaignInfoCid,
            nftMetadataCid,
            amount
        );

        addTree(merkleRoot);
    }

    function claim(
        uint64 treeId,
        uint256 index,
        string calldata target,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) virtual external {
        require(proof(treeId, index, target, amount, merkleProof));

        _mint(msg.sender, uint256(treeId), amount, "");
    }
}
