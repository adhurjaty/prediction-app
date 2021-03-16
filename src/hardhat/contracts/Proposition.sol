pragma solidity >=0.7.0 <0.8.0;

contract Proposition {

    mapping (address => bool) members;
    mapping (address => uint256) member_wagers;
    uint256 public wager_pool;
    
    // modifier to check if caller is a member
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
     * @dev Set contract deployer as owner
     */
    constructor() {
        members[msg.sender] = true;
    }

    /**
     * @dev Add member of group
     * @param newMember address of new member
     */
    function addMember(address newMember) public isMember {
        members[newMember] = true;
    }

    function addBet(uint256 wager) public isMember {
         member_wagers[msg.sender] += wager;
         wager_pool += wager;
    }
}
