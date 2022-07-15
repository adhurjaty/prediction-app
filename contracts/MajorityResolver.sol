// SPDX-License-Identifier: UNLICENSED
pragma solidity >= 0.7.0;

import './VoteYesNoResolver.sol';

abstract contract MajorityResolver is VoteYesNoResolver {

    function setResolved(YesNo vote) internal override {
        require(resolution == YesNo.PENDING, "Bet has already resolved");

        if(numYeses > numMembers / 2 || numNos > numMembers / 2) {
            resolution = vote;
        }
    }
}