// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0;

import "./Bet.sol";

contract BetAgainstMe is Bet {

    /* The person everyone is betting against */
    address hub;

    /* Hashes of the outcomes for interacting with the Resolver */
    bytes32 hub_outcome_hash;
    bytes32 spoke_outcome_hash;

    constructor(
        string memory _title, 
        uint _resolution_time, 
        uint _bet_closing_time, 
        address _hub, 
        string memory _hub_outcome,
        string memory _spoke_outcome
    ) 
        Bet(_title,_resolution_time,_bet_closing_time) 
    { 
        hub = _hub;
        hub_outcome_hash = keccak256(bytes(_hub_outcome));
        spoke_outcome_hash = keccak256(bytes(_spoke_outcome));
    }

    function wager() override public payable isMember {
        if (msg.sender == hub) {
            // This is the hub wagering
            bets[msg.sender] += msg.value;
        } else {
            // This is a spoke wagering
            require(bets[hub] >= pool + msg.value);

            bets[msg.sender] += msg.value;
            pool += msg.value;
        }

        emit Wager(msg.sender, msg.value);
    }

    /**
     * @notice Pays a member of the bet after the bet has been resolved
     * @param _to the 
     * @param _amount unused in this bet type
     */
    function pay(address payable _to, uint256 _amount) override public isCommissioner {
        require(members[_to], "Payee is not a member");
        uint256 amount = bets[_to] * 2;
        (bool success, ) = _to.call{value: amount}("");
        require(success, "Failed to send Ether");
        emit PayMember(_to, amount);
    }
}