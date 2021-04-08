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

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "../interfaces/TokenFactoryInterfaceV1.sol";
import "../issuance/SocialToken.sol";
import "../issuance/TreasuryVester.sol";

// TODO add description about percentage
// TODO add Clonable ERC20
contract TokenFactory is TokenFactoryInterfaceV1, Ownable {
    using SafeMath for uint256;

    address private operator;
    address private donatee;
    address private creatorFund;
    address private treasuryVester;

    // TODO emit event
    // TODO consider owner should be changed initially
    constructor(
        address _operator,
        address _donatee,
        address _creatorFund,
        address _treasuryVester
    ) {
        operator = _operator;
        donatee = _donatee;
        creatorFund = _creatorFund;
        treasuryVester = _treasuryVester;
    }

    // TODO emit event
    function updateCreatorFund(address newCreatorFund) public onlyOwner {
        creatorFund = newCreatorFund;
    }

    // TODO emit event
    // TODO consider treasury vester management (here or frontend)
    function updateTreasuryVester() public {

    }

    function createToken(
        string memory name,
        string memory symbol,
        uint16 donationRatio // percentage with decimal 2
    ) external override {
        createActualToken(msg.sender, name, symbol, 0, donationRatio);
    }

    // TODO Add variable years
    function createExclusiveToken(
        address creator,
        string memory name,
        string memory symbol,
        uint16 donationRatio,
        uint16 operationRatio
    ) external override {
        createActualToken(creator, name, symbol, operationRatio, donationRatio);
    }

    function createActualToken(
        address creator,
        string memory name,
        string memory symbol,
        uint16 operationRatio,
        uint16 donationRatio
    ) private {
        SocialToken token = new SocialToken(name, symbol, address(this));

        emit CreateToken(
            address(token),
            creator
        );

        transferToken(msg.sender, address(token), operationRatio, donationRatio);
        TreasuryVester(treasuryVester).addVesting(
            address(token),
            creator,
            block.timestamp
        );
    }

    function transferToken(
        address creator,
        address _token,
        uint16 operationRatio,
        uint16 donationRatio
    ) internal {
        // transfer to token creator(for operation)
        // TODO add safe math
        uint16 distributionRatio = 2000 - operationRatio;

        SocialToken token = SocialToken(_token);

        // TODO check gas for casting
        token.transfer(
            creator,
            SocialTokenConstants.totalSupply.mul(distributionRatio).div(10000)
        );
        if (operationRatio > 0) {
            token.transfer(
                operator,
                SocialTokenConstants.totalSupply.mul(operationRatio).div(10000)
            );
        }

        // transfer to treasury vester
        uint16 vestingRatio = 8000 - donationRatio;
        token.transfer(
            treasuryVester,
            SocialTokenConstants.totalSupply.mul(vestingRatio).div(10000)
        );
        if (donationRatio > 0) {
            // TODO use safe math
            token.transfer(
                donatee,
                SocialTokenConstants.totalSupply.mul(donationRatio / 2).div(10000)
            );
            token.transfer(
                creatorFund,
                SocialTokenConstants.totalSupply.mul(donationRatio / 2).div(10000)
            );
        }
    }
}
