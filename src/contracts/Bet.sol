// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0; // <0.8.0;

import './MembersOnly.sol';
import "./Resolver.sol";

/** 
 * @title Base contract for a bet
 * @author Bragging Rights
 */
/* TODO: Bet maybe should override addMember to also addMember to the resolver */
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
    event PayMember(address payee, uint amount);
    
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
     */
    function wager() virtual public payable isMember {
        emit Wager(msg.sender, msg.value);

        bets[msg.sender] += msg.value;
        pool += msg.value;
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

    /**
     * @dev
     */
    function pay(address payable _to, uint256 _amount) virtual public isCommissioner {
        require(members[_to], "Payee is not a member");
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");
        emit PayMember(_to, _amount);
    }
}

/** 
 * @title Bet type where each bettor risks an equal share
 * @author Bragging Rights
 */
contract EqualAnteBet is Bet {

    constructor(string memory _title, uint _resolution_time, uint _bet_closing_time) Bet(_title,_resolution_time,_bet_closing_time) { }

    /**
     * @dev Adds a bet to the pool if the amount to be wagered is exactly 1
     */
    function wager() override public payable isMember {
        require(msg.value == 1, "Cannot wager more than 1 in an equal ante bet");
        require(bets[msg.sender] < 1, "Sender has already wagered");

        emit Wager(msg.sender, msg.value);

        bets[msg.sender] = msg.value;
        pool += msg.value;
        numBettors += 1;
    }
}
