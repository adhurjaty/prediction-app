// SPDX-License-Identifier: UNLICENSED
pragma solidity >= 0.7.0;

import './MembersOnly.sol';

abstract contract YesNoResolver is membersOnly {
    enum YesNo { PENDING, YES, NO }

    YesNo resolution = YesNo.PENDING;
    mapping (address => YesNo) votes;

    function resolve() virtual payable public returns(address[] memory winners);
}