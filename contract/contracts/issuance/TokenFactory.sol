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
import "@openzeppelin/contracts/proxy/Clones.sol";
import "../interfaces/TokenFactoryInterfaceV1.sol";
import "../issuance/SocialToken.sol";
import "../issuance/TreasuryVester.sol";

contract TokenFactory is TokenFactoryInterfaceV1, Ownable {
    using SafeMath for uint256;

    address private operator;
    address private donatee;
    address private creatorFund;
    address private treasuryVester;
    address private socialTokenImplementation;

    constructor(
        address _operator,
        address _donatee,
        address _creatorFund,
        address _treasuryVester
    ) {
        updateOperator(_operator);
        updateDonatee(_donatee);
        updateCreatorFund(_creatorFund);
        updateTreasuryVester(_treasuryVester);

        socialTokenImplementation = address(new SocialToken());
    }

    function updateOperator(address newOperator) public override onlyOwner {
        operator = newOperator;
        emit UpdateOperator(newOperator);
    }

    function updateDonatee(address newDonatee) public override onlyOwner {
        donatee = newDonatee;
        emit UpdateDonatee(newDonatee);
    }

    function updateCreatorFund(address newCreatorFund) public override onlyOwner {
        creatorFund = newCreatorFund;
        emit UpdateCreatorFund(newCreatorFund);
    }

    function updateTreasuryVester(address newTreasuryVester) public override onlyOwner {
        treasuryVester = newTreasuryVester;
        emit UpdateTreasuryVester(newTreasuryVester);
    }

    /**
      * @param donateeRatio percentage with decimal 2
      * @param creatorFundRatio percentage with decimal 2
      *        Pass a percent multiplied by 100. e.g. 10% => 1000
      */
    function createToken(
        string memory name,
        string memory symbol,
        uint256 donateeRatio,
        uint256 creatorFundRatio // percentage with decimal 2
    ) external override {
        createActualToken(
            msg.sender,
            name,
            symbol,
            0,
            donateeRatio,
            creatorFundRatio,
            3
        );
    }

    /**
      * @param operationRatio percentage with decimal 2
      * @param donateeRatio percentage with decimal 2
      * @param creatorFundRatio percentage with decimal 2
      *        Pass a percent multiplied by 100. e.g. 10% => 1000
      * @param vestingYears percentage with decimal 0
      */
    function createExclusiveToken(
        address creator,
        string memory name,
        string memory symbol,
        uint256 operationRatio,
        uint256 donateeRatio,
        uint256 creatorFundRatio,
        uint256 vestingYears
    ) external override {
        createActualToken(
            creator,
            name,
            symbol,
            operationRatio,
            donateeRatio,
            creatorFundRatio,
            vestingYears)
        ;
    }

    function createActualToken(
        address creator,
        string memory name,
        string memory symbol,
        uint256 operationRatio,
        uint256 donateeRatio,
        uint256 creatorFundRatio,
        uint256 vestingYears
    ) private {
        address token = Clones.clone(socialTokenImplementation);
        SocialToken(token).initialize(
            name,
            symbol,
            creator,
            operator,
            donatee,
            treasuryVester,
            creatorFund,
            operationRatio,
            donateeRatio,
            creatorFundRatio
        );

        TreasuryVester(treasuryVester).addVesting(
            token,
            creator,
            vestingYears
        );

        emit CreateToken(
            token,
            creator
        );
    }
}
