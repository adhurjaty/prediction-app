// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0; // <0.8.0;

import './MembersOnly.sol';
import "./Resolver.sol";

/** 
 * @title Base proposition contract
 * @author Bragging Rights
 * TODO: turn this into an abstract contract
 */
contract Bet is managed, resolvable {

    /* Bets per member */
    mapping (address => uint256) bets;
    uint public numBettors;

    /** Total amount wagered in the pool */
    uint256 public pool;

    /** Description of the proposition, e.g. "What will the price of ETH be?" */
    string public title;

    /** Time when the proposition will be closed to new bets (s since epoch) */
    uint public bet_closing_time;

    event Wager(address member, uint256 wager);
    
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
        emit Wager(msg.sender, _amount);

        bets[msg.sender] += _amount;
        pool += _amount;
    }

    /**
     * @dev Checks a bet to the pool
     */
    function getMyWager() public view isMember returns (uint256) {
        return bets[msg.sender];
    }

    function getWager(address bettor) public view isResolver returns (uint256) {
        return bets[bettor];
    }
}

/** 
 * @title Bet type where each bettor has an equal share
 * @author Bragging Rights
 */
contract EqualAnteBet is Bet {

    constructor(string memory _title, uint _resolution_time, uint _bet_closing_time) Bet(_title,_resolution_time,_bet_closing_time) { }

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
        if (bets[msg.sender] < 1) {
            emit Wager(msg.sender, 1);

            bets[msg.sender] = 1;
            pool += 1;
            numBettors += 1;
        }
    }

}
