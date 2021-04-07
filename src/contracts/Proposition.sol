// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0; // <0.8.0;

// TODO: Terminology struggles (bet, wager, pool)

/**
 * @title Helper contract that provides ability to track membership and restrict actions
 */
contract MembersOnly {
    mapping (address => bool) members;

    /**
     * @dev Restricts modified functions to members-only
     */
    modifier isMember() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(members[msg.sender], "Caller is not a member"); 
        _;
    }

    /**
     * @dev Adds a member to the contract
     * @param newMember Address of new member
     */
    function addMember(address newMember) public isMember {
        members[newMember] = true;
    }

    /**
     * @dev Checks account membership to the contract
     * @param account Address of the account to be checked
     * @return membership 
     */
    function checkMembership(address account) public view returns (bool) {
        return members[account];
    }
}

/** 
 * @title Base proposition contract
 */
contract Proposition is MembersOnly {

    /* Bets per member */
    mapping (address => uint256) bets;

    /** Total amount wagered in the pool */
    uint256 public pool;

    /** Description of the proposition, e.g. "What will the price of ETH be?" */
    string public title;

    /** Time when the proposition will be resolved (s since epoch) */
    uint public bet_closing_time;

    /** Time when the proposition will be closed to new bets (s since epoch) */
    uint public resolution_time;
    
    
    /**
     * @dev Set contract deployer as a member
     * @param _title Title to set for the proposition
     * @param _resolution_time Time when the proposition will be resolved (s since epoch)
     * @param _bet_closing_time Time when the proposition will be closed to new bets (s since epoch)
     */
    constructor(string memory _title, uint _resolution_time, uint _bet_closing_time) {
        members[msg.sender] = true;
        title = _title;
        resolution_time = _resolution_time;
        bet_closing_time = _bet_closing_time;
    }

    /**
     * @dev Adds a bet to the pool
     * @param amount Amount to be wagered
     */
    function wager(uint256 amount) virtual public isMember {
        bets[msg.sender] += amount;
        pool += amount;
    }

    /**
     * @dev Checks a bet to the pool
     */
    function getMyBet() public view isMember returns (uint256) {
        return bets[msg.sender];
    }
}

/** @title Proposition type where each bettor has an equal share */
contract EqualAnteProposition is Proposition {

    constructor(string memory _title, uint _resolution_time, uint _bet_closing_time) Proposition(_title,_resolution_time,_bet_closing_time) { }

    /**
     * @dev Adds a bet to the pool if the amount to be wagered is exactly 1
     * @param amount Amount to be wagered
     */
    function wager(uint256 amount) override public isMember {
        require(amount == 1, "Cannot wager more than 1 in an equal ante proposition");
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
