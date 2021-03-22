pragma solidity >=0.7.0 <0.8.0;


// TODO: Terminology struggles (bet, wager, pool)

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
        require(members[msg.sender], "Caller is not a member"); // or however you do a quick array search in Solidity...
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
     */
    function checkMembership(address account) public view returns (bool) {
        return members[account];
    }
}

// contract Bet {
//     mapping (address => uint256) bets;
//     uint256 public pool;

//     /**
//      * @dev Checks a bet to the pool
//      */
//     // function getMyBet() public view isMember returns (uint256) {
//     //     return bets[msg.sender];
//     // }
// }

// contract EqualBet is MembersOnly, Bet {
//     /**
//      * @dev Adds a bet to the pool
//      */
//     function wager() public isMember {
//         bets[msg.sender] = 1;
//         pool += 1;
//     }
// }

/** 
 * @title Base proposition contract
 */
contract Proposition is MembersOnly {

    // mapping (address => bool) members;

    mapping (address => uint256) bets;
    uint256 public pool;

    string public title;
    uint public bet_closing_time;
    uint public resolution_time;
    
    
    /**
     * @dev Set contract deployer as a member
     */
    constructor(string memory _title, uint _resolution_time, uint _bet_closing_time) {
        members[msg.sender] = true;
        title = _title;
        resolution_time = _resolution_time;
        bet_closing_time = _bet_closing_time;
    }

    // constructor(uint _resolution_time, uint _bet_closing_time) {
    //     members[msg.sender] = true;
    //     title = "Not set";
    //     resolution_time = _resolution_time;
    //     bet_closing_time = _bet_closing_time;
    // }

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

contract EqualAnteProposition is Proposition {

    constructor(string memory _title, uint _resolution_time, uint _bet_closing_time) Proposition(_title,_resolution_time,_bet_closing_time) { }
    // constructor(uint _resolution_time, uint _bet_closing_time) Proposition("Test",_resolution_time,_bet_closing_time) { }

    /**
     * @dev Adds a bet to the pool
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
