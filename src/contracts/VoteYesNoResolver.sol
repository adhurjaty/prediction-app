// SPDX-License-Identifier: UNLICENSED
pragma solidity >= 0.7.0;

import './YesNoResolver.sol';

abstract contract VoteYesNoResolver is YesNoResolver {
    uint numYeses = 0;
    uint numNos = 0;

    function voteResolve(YesNo vote) virtual public isMember {
        require(votes[msg.sender] == YesNo.PENDING, "Already voted");
        require(vote != YesNo.PENDING, "Must vote yes or no");
        require(resolution == YesNo.PENDING, "Bet has already resolved");

        votes[msg.sender] = vote;
        if(vote == YesNo.YES) {
            numYeses += 1;
        } else {
            numNos += 1;
        }

        setResolved(vote);
    }

    function setResolved(YesNo vote) virtual internal;
}