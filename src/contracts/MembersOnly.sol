// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0; // <0.8.0;

/**
 * @title Helper contract that provides ability to track membership and restrict actions
 */
contract membersOnly {
    mapping (address => bool) members;
    uint numMembers;

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
     * @param _new_member Address of new member
     */
    function addMember(address _new_member) virtual public isMember {
        members[_new_member] = true;
        numMembers += 1;
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
 * @title TODO: documentation
 * @author Bragging Rights
 */
contract managed is membersOnly {
    address commissioner;

    /** 
     * @dev 
     */
    modifier isCommissioner() {
        require(msg.sender == commissioner, "Caller is not the commissioner");
        _;
    }

    /**
     */
    function setCommissioner(address _new_commissioner) public isCommissioner {
        commissioner = _new_commissioner;
    }

    /**
     * @dev Adds a member to the contract; should not be able to add themselves
     * @param _new_member Address of new member
     */
    function addMember(address _new_member) override public isCommissioner {
        members[_new_member] = true;
        numMembers += 1;
    }
}