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

    modifier isResolver() {
        require(msg.sender == address(resolution), "Caller is not the resolver");
        _;
    }

    /** TODO: this should be protected by isCommissioner... */
    function setResolution(address _resolution) public {
        resolution = Resolution(_resolution);
    }
    
    /**  */
    function isResolved() view public returns(bool) {
        return resolution.isResolved();
    }
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
    
    struct VoteTally {
        bool valid;
        uint16 count;
    }

    bytes32[] resultOptions;

    mapping (address => MemberVote) memberVotes;
    mapping (bytes32 => VoteTally) voteTally;
    uint16 public votesCast;
    uint16 public votesCastToResolve;

    enum MajorityType { SIMPLE_MAJORITY, UNANIMITY }

    MajorityType constant defaultMajorityType = MajorityType.UNANIMITY;
    MajorityType voteMajorityType;
    MajorityType resultMajorityType;

    event VoteRecorded(address sender, string result, bytes32 result_hash); // 5c816d06f8f1bd89fdffe48bd51f5a428eb7bc948f30d5996d2075a715d686dc
    event VoteCount(uint256 votesCast, uint256 numBettors); // 13cbe618ace9cb5c298a4d2858b8cc4ed33766a32ad48e009363cee124b48191
    event ResultCount(bytes32 result_hash, uint256 count); // e850e319647c0d97db7d1a892d0beb081b444c94801a7952b8026f19a1243df9
    event ResolutionResultReached(bytes32 result_hash); // 287c63dc86a1c54968b1c8dde0e1f2960f18558ddb28c8956d86452fdd0d3691
    event ResolutionResultNotReached(string reason);

    constructor(address _proposition) Resolution(_proposition) {
        // TODO: initialize memberVotes, voteTally, votesCast, but this costs gas
        voteMajorityType = defaultMajorityType;
        resultMajorityType = MajorityType.UNANIMITY;
    }

    // constructor(address _proposition, MajorityType _type) Resolution(_proposition) {
    //     // TODO: initialize memberVotes, voteTally, votesCast, but this costs gas
    //     majorityType = _type;
    // }

    modifier votingOpen() {
        require(isResolved == false, "Bet has been resolved already");
        _;
    }

    modifier isBettor(address bettor) {
        require(proposition.getWager(bettor) > 0, "Caller is not a bettor in the bet");
        _;
    }

    function addResultOption(string memory _option) public isCommissioner votingOpen {
        bytes32 resultHash = getResultHash(_option);

        if (voteTally[resultHash].valid == false) {
            voteTally[resultHash].valid = true;
            resultOptions.push(getResultHash(_option));
        }

    }

    function voteResolved(string memory _result) virtual public isMember votingOpen isBettor(msg.sender) {
        emit VoteRecorded(msg.sender, _result, getResultHash(_result));

        bytes32 hashed_result = getResultHash(_result);

        // Record the member's vote
        if (memberVotes[msg.sender].resolve == false) {
            // This is the first time sender has voted
            // TODO: check to make sure result is one of the result options
            memberVotes[msg.sender].resolve = true;
            memberVotes[msg.sender].result = hashed_result;
            voteTally[hashed_result].count += 1;
            votesCast += 1;
            votesCastToResolve += 1;
        }
        else {
            bytes32 old_result = memberVotes[msg.sender].result;
            if (hashed_result != old_result) {
                // The sender is changing their vote
                voteTally[old_result].count -= 1;
                voteTally[hashed_result].count += 1;
                memberVotes[msg.sender].result = hashed_result;
            }
        }

        checkMajority();
    }

    function voteNotResolved() public isMember votingOpen {
        // emit 
        votesCast += 1;

        checkMajority();
    }

    function checkMajority() private returns (bool) {
        uint numBettors = proposition.numBettors();
        emit VoteCount(votesCast, numBettors);

        // See if a majority has been reached
        // TODO: is there a potential race condition here if two people are voting simultaneously?
        if (voteMajorityType == MajorityType.SIMPLE_MAJORITY) {
            if (votesCast >= numBettors/2.0) {
                if (votesCastToResolve >= numBettors/2.0) {
                    isResolved = true;
                    tabulateResult(numBettors);
                }
            }
        } else if (voteMajorityType == MajorityType.UNANIMITY) {
            if (votesCast == numBettors) {
                isResolved = true;
                tabulateResult(numBettors);
            }
        } else {
            // this should not happen
        }

        return true;
    }

    function tabulateResult(uint numBettors) private returns (bytes32) {

        if (resultMajorityType == MajorityType.UNANIMITY) {
            uint i;
            bool resultReached = false;

            for(i=0; i<resultOptions.length; i += 1) {
                bytes32 _result = resultOptions[i];
                uint16 _voteTally = voteTally[resultOptions[i]].count;
                emit ResultCount(_result, _voteTally);
                if (_voteTally == numBettors) {
                    emit ResolutionResultReached(_result);
                    resultReached = true;
                    break;
                }
            }

            if (!resultReached) {
                emit ResolutionResultNotReached("Unanimous agreement on result needed");
                return 0;
            }
        }
        
        return 0;
    }

    function getResultHash(string memory _result) pure private returns(bytes32) {
        return keccak256(bytes(_result));
    }
}