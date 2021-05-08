// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0; // <0.8.0;

// TODO: Terminology struggles (bet, wager, pool)

import './MembersOnly.sol';
import "./Resolution.sol";

/** 
 * @title Base proposition contract
 * @author Bragging Rights
 */
contract Proposition is managed, resolvable {

    /* Bets per member */
    mapping (address => uint256) bets;

    /** Total amount wagered in the pool */
    uint256 public pool;

    /** Description of the proposition, e.g. "What will the price of ETH be?" */
    string public title;

    /** Time when the proposition will be closed to new bets (s since epoch) */
    uint public bet_closing_time;

    
    /**
     * @dev Set contract deployer as a member
     * @param _title Title to set for the proposition
     * @param _resolution_time Time when the proposition will be resolved (s since epoch)
     * @param _bet_closing_time Time when the proposition will be closed to new bets (s since epoch)
     */
    constructor(string memory _title, uint _resolution_time, uint _bet_closing_time) {
        commissioner = msg.sender;
        title = _title;
        resolution_time = _resolution_time;
        bet_closing_time = _bet_closing_time;
    }

    /**
     * @dev Adds a bet to the pool
     * @param _amount Amount to be wagered
     */
    function wager(uint256 _amount) virtual public isMember {
        bets[msg.sender] += _amount;
        pool += _amount;
    }

    /**
     * @dev Checks a bet to the pool
     */
    function getMyBet() public view isMember returns (uint256) {
        return bets[msg.sender];
    }
}

/** 
 * @title Proposition type where each bettor has an equal share
 * @author Bragging Rights
 */
contract EqualAnteProposition is Proposition {

    constructor(string memory _title, uint _resolution_time, uint _bet_closing_time) Proposition(_title,_resolution_time,_bet_closing_time) { }

    /**
     * @dev Adds a bet to the pool if the amount to be wagered is exactly 1
     * @param _amount Amount to be wagered
     */
    function wager(uint256 _amount) override public isMember {
        require(_amount == 1, "Cannot wager more than 1 in an equal ante proposition");
        wager();
    }

    /**
     * @dev Adds a bet to the pool
     */
    function wager() public isMember {
        bets[msg.sender] = 1;
        pool += 1;
    }

}
