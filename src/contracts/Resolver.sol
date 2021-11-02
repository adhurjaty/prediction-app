// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0; // <0.8.0;

import './MembersOnly.sol';
import './Bet.sol';

/**
 * @title Interface contract for bets that are resolved using a Resolver contract
 * @author Anthony Wong
 */
/* TODO: Should this be incorporated directly into Bet? */
/* TODO: documentation */
contract resolvable {
    /**  */
    Resolver private resolver;

    /** Time when the proposition will be resolved (s since epoch) */
    uint public resolution_time;

    event SetResolver(address resolver);

    modifier isResolver() {
        require(msg.sender == address(resolver), "Caller is not the resolver");
        _;
    }

    /** FIXME: this should be protected by isCommissioner... */
    function setResolver(address _resolver) public {
        resolver = Resolver(_resolver);
        emit SetResolver(_resolver);
    }
    
    /**  */
    function isResolved() view public returns(bool) {
        return resolver.isResolved();
    }
}

/* TODO: documentation */
/**
 * @title Base contract responsible for resolution of bets
 * @author Anthony Wong
 */
contract Resolver is managed {
    Bet public bet;
    bool public isResolved;

    constructor(address _bet) {
        commissioner = msg.sender;
        setBet(_bet);
        isResolved = false;
    }

    function setBet(address _bet) private {
        bet = Bet(_bet);
    }


}

// contract ResolutionByDate is Resolution {
//     constructor() {
//         /* settype */
//     }
// }

// contract ResolutionByEvent is Resolution {

// }

/**
 * @title Resolver 
 * @author Anthony Wong
 */
/* TODO: documentation */
contract ResolverByVote is Resolver {

    struct MemberVote {
        bool resolve;
        bytes32 outcome;
    }
    
    struct VoteTally {
        bool valid;
        uint16 count;
    }

    bytes32[] outcomeOptions;

    mapping (address => MemberVote) memberVotes;
    mapping (bytes32 => VoteTally) voteTally;
    uint16 public votesCast;
    uint16 public votesCastToResolve;

    enum MajorityType { SIMPLE_MAJORITY, UNANIMITY }

    MajorityType constant defaultMajorityType = MajorityType.UNANIMITY;
    MajorityType voteMajorityType;
    MajorityType outcomeMajorityType;

    event VoteRecorded(address sender, string outcome, bytes32 outcome_hash); // 5c816d06f8f1bd89fdffe48bd51f5a428eb7bc948f30d5996d2075a715d686dc
    event VoteCount(uint256 votesCast, uint256 numBettors); // 13cbe618ace9cb5c298a4d2858b8cc4ed33766a32ad48e009363cee124b48191
    event OutcomeCount(bytes32 outcome_hash, uint256 count); // e850e319647c0d97db7d1a892d0beb081b444c94801a7952b8026f19a1243df9
    event ResolutionOutcomeReached(bytes32 result_hash); // 287c63dc86a1c54968b1c8dde0e1f2960f18558ddb28c8956d86452fdd0d3691
    event ResolutionOutcomeNotReached(string reason);

    constructor(address _bet) Resolver(_bet) {
        // TODO: initialize memberVotes, voteTally, votesCast, but this costs gas
        voteMajorityType = defaultMajorityType;
        outcomeMajorityType = MajorityType.UNANIMITY;
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
        require(bet.getWager(bettor) > 0, "Caller is not a bettor in the bet");
        _;
    }

    function addOutcomeOption(string memory _option) public isCommissioner votingOpen {
        bytes32 resultHash = getOutcomeHash(_option);

        if (voteTally[resultHash].valid == false) {
            voteTally[resultHash].valid = true;
            outcomeOptions.push(getOutcomeHash(_option));
        }

    }

    function voteResolved(string memory _outcome) virtual public isMember votingOpen isBettor(msg.sender) {
        emit VoteRecorded(msg.sender, _outcome, getOutcomeHash(_outcome));

        bytes32 hashed_outcome = getOutcomeHash(_outcome);

        // Record the member's vote
        if (memberVotes[msg.sender].resolve == false) {
            // This is the first time sender has voted
            // TODO: check to make sure result is one of the result options
            memberVotes[msg.sender].resolve = true;
            memberVotes[msg.sender].outcome = hashed_outcome;
            voteTally[hashed_outcome].count += 1;
            votesCast += 1;
            votesCastToResolve += 1;
        }
        else {
            bytes32 old_result = memberVotes[msg.sender].outcome;
            if (hashed_outcome != old_result) {
                // The sender is changing their vote
                voteTally[old_result].count -= 1;
                voteTally[hashed_outcome].count += 1;
                memberVotes[msg.sender].outcome = hashed_outcome;
            }
        }

        checkMajority();
    }

    function voteNotResolved() public isMember votingOpen {
        // emit 
        votesCast += 1;

        checkMajority();
    }

    /** 
     * @notice Checks to see if a majority of resolution votes has been reached 
     * @return majorityReached
     */
    function checkMajority() private returns (bool majorityReached) {
        uint numBettors = bet.numBettors();
        emit VoteCount(votesCast, numBettors);

        // See if a majority has been reached
        // TODO: is there a potential race condition here if two people are voting simultaneously?
        if (voteMajorityType == MajorityType.SIMPLE_MAJORITY) {
            if (votesCast >= numBettors/2.0) {
                if (votesCastToResolve >= numBettors/2.0) {
                    isResolved = true;
                    tabulateOutcome(numBettors);
                }
            }
        } else if (voteMajorityType == MajorityType.UNANIMITY) {
            if (votesCast == numBettors) {
                isResolved = true;
                tabulateOutcome(numBettors);
            }
        } else {
            // this should not happen
        }

        return true;
    }

    /** 
     * @notice Checks to see if a majority of resolution votes has been reached 
     * @param numBettors the number of somethings
     * @return majorityReached
     */
    function tabulateOutcome(uint numBettors) private returns (bytes32) {

        if (outcomeMajorityType == MajorityType.UNANIMITY) {
            uint i;
            bool resultReached = false;

            for(i=0; i<outcomeOptions.length; i += 1) {
                bytes32 _outcome = outcomeOptions[i];
                uint16 _voteTally = voteTally[outcomeOptions[i]].count;
                emit OutcomeCount(_outcome, _voteTally);
                if (_voteTally == numBettors) {
                    emit ResolutionOutcomeReached(_outcome);
                    resultReached = true;
                    break;
                }
            }

            if (!resultReached) {
                emit ResolutionOutcomeNotReached("Unanimous agreement on result needed");
                return 0;
            }
        }
        
        return 0;
    }

    function getOutcomeHash(string memory _outcome) pure private returns(bytes32) {
        return keccak256(bytes(_outcome));
    }
}