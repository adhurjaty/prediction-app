// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0; // <0.8.0;

import "./MembersOnly.sol";
import "./MajorityResolver.sol";

contract OtherBet is managed, MajorityResolver {
    string title;
    
    /** Time when the proposition will be closed to new bets (s since epoch) */
    uint public bet_closing_time;
}
