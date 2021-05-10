// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0; // <0.8.0;

import './MembersOnly.sol';
import './Proposition.sol';

/* TODO: documentation */
contract resolvable {
    /**  */
    Resolution resolution;

    /** Time when the proposition will be resolved (s since epoch) */
    uint public resolution_time;

    /**  */
    function setResolution(address _resolution) private {
        resolution = Resolution(_resolution);
    }
    
    /**  */
    function isResolved() view public returns(bool) {
        return resolution.isResolved();
    }

    // function vote(bool result) public {
    //     resolution.vote(result);
    // }
}

/* TODO: documentation */
contract Resolution is managed {
    Proposition public proposition;
    bool public isResolved;

    constructor(address _proposition) {
        commissioner = msg.sender;
        setProposition(_proposition);
        isResolved = false;
    }

    function setProposition(address _proposition) private {
        proposition = Proposition(_proposition);
    }


}

// contract ResolutionByDate is Resolution {
//     constructor() {
//         /* settype */
//     }
// }

// contract ResolutionByEvent is Resolution {

// }

contract ResolutionByVote is Resolution {
    struct MemberVote {
        bool resolve;
        bytes32 result;
    }

    mapping (address => MemberVote) memberVotes;
    mapping (bytes32 => uint) voteTally;
    uint votesCast;

    event VoteRecorded(address sender, string result, bytes32 result_hash);

    constructor(address _proposition) Resolution(_proposition) {
        // TODO: initialize memberVotes and voteTally
    }

    modifier votingOpen() {
        require(isResolved == false, "Proposition has been resolved already");
        _;
    }

    function vote(string memory _result) virtual public isMember votingOpen {
        emit VoteRecorded(msg.sender, _result, getResultHash(_result));

        bytes32 hashed_result = getResultHash(_result);

        // Record the member's vote
        if (memberVotes[msg.sender].resolve == false) {
            // This is the first time sender has voted
            memberVotes[msg.sender].resolve = true;
            memberVotes[msg.sender].result = hashed_result;
            voteTally[hashed_result] += 1;
        }
        else {
            bytes32 old_result = memberVotes[msg.sender].result;
            if (hashed_result != old_result) {
                // The sender is changing their vote
                voteTally[old_result] -= 1;
                voteTally[hashed_result] += 1;
                memberVotes[msg.sender].result = hashed_result;
            }
        }

        // See if a majority of votes have been cast
        // TODO: is there a potential race condition here if two people are voting simultaneously?
        // if ()

    }

    function getResultHash(string memory _result) pure private returns(bytes32) {
        return keccak256(bytes(_result));
    }
}