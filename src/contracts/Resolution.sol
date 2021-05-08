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
    bool public is_resolved;

    /**  */
    function setResolution(address _resolution) private {
        resolution = Resolution(_resolution);
    }
    
    // function vote(bool result) public {
    //     resolution.vote(result);
    // }
}

/* TODO: documentation */
contract Resolution is managed {
    Proposition proposition;
    bool is_resolved;

    constructor(address _proposition) {
        setProposition(_proposition);
        is_resolved = false;
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

    mapping (address => MemberVote) member_votes;
    mapping (bytes32 => uint) vote_tally;

    event VoteRecorded(address sender, string result, bytes32 result_hash);

    constructor(address _proposition) Resolution(_proposition) {
        // TODO: initialize member_votes and vote_tally
    }

    modifier votingOpen() {
        require(is_resolved == false, "Proposition has been resolved already");
        _;
    }

    function vote(string memory _result) virtual public isMember votingOpen {
        emit VoteRecorded(msg.sender, _result, getResultHash(_result));

        bytes32 hashed_result = getResultHash(_result);

        if (member_votes[msg.sender].resolve == false) {
            // This is the first time sender has voted
            member_votes[msg.sender].resolve = true;
            member_votes[msg.sender].result = hashed_result;
            vote_tally[hashed_result] += 1;
        }
        else {
            bytes32 old_result = member_votes[msg.sender].result;
            if (hashed_result != old_result) {
                // The sender is changing their vote
                vote_tally[old_result] -= 1;
                vote_tally[hashed_result] += 1;
                member_votes[msg.sender].result = hashed_result;
            }
        }
    }

    function getResultHash(string memory _result) pure private returns(bytes32) {
        return keccak256(bytes(_result));
    }
}