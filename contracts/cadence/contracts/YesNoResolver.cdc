import BetInterfaces from "./BetInterfaces.cdc"
import ResolverInterfaces from "./ResolverInterfaces.cdc"
import YesNoBet from "./YesNoBet.cdc"

pub contract YesNoResolver {
    pub struct UserVote {
        pub let address: Address
        pub let vote: Bool?

        init(address: Address, vote: Bool?) {
            self.address = address
            self.vote = vote
        }
    }

    pub struct State: ResolverInterfaces.State {
        pub var isResolved: Bool
        pub var result: Bool?
        pub let votes: {String: UserVote}

        init() {
            self.isResolved = false
            self.result = nil
            self.votes = {}
        }

        pub fun addVote(vote: UserVote) {
            self.votes[vote.address.toString()] = vote
        }

        pub fun setResolved(result: Bool?) {
            self.isResolved = true
            self.result = result
        }
    }

    pub resource UserToken: ResolverInterfaces.Token {
        pub let betId: String
        pub let address: Address
        pub var vote: Bool?

        init(betId: String, address: Address) {
            self.betId = betId
            self.address = address
            self.vote = nil
        }

        pub fun setVote(vote: Bool?) {
            self.vote = vote
        }
    }

    pub resource MajorityResolver: ResolverInterfaces.Resolver, ResolverInterfaces.TokenMinter {
        priv let betTokenMinter: @YesNoBet.ResultTokenMinter

        pub let betId: String
        pub let state: AnyStruct{ResolverInterfaces.State}
        pub let numMembers: Int

        init(betId: String, betTokenMinter: @YesNoBet.ResultTokenMinter, numMembers: Int) {
            self.betId = betId
            self.betTokenMinter <-betTokenMinter
            self.numMembers = numMembers
            self.state = State()
        }

        pub fun vote(token: @AnyResource{ResolverInterfaces.Token}) {
            let userToken <-token as! @UserToken
            let state = self.state as! State

            if state.votes.containsKey(userToken.address.toString()) {
                panic("User has already voted")
            }

            let vote = UserVote(address: userToken.address, vote: userToken.vote)
            state.addVote(vote: vote)

            destroy userToken
        }

        pub fun resolve(): @AnyResource{BetInterfaces.Result}? {
            let state = self.state as! State
            let userVotes = state.votes.values

            // If there are not enough votes for a majority, return nil
            if userVotes.length < self.numMembers / 2 {
                return nil
            }

            var yesVotes = 0
            var noVotes = 0
            var ambiguousVotes = 0

            for userVote in userVotes {
                if userVote.vote == nil {
                    ambiguousVotes = ambiguousVotes + 1
                }
                if userVote.vote == true {
                    yesVotes = yesVotes + 1
                }
                if userVote.vote == false {
                    noVotes = noVotes + 1
                }
            }

            var outcome: Bool? = nil
            if yesVotes > self.numMembers / 2 {
                outcome = true
            } else if noVotes > self.numMembers / 2 {
                outcome = false
            } else if ambiguousVotes > self.numMembers / 2 
                || userVotes.length == self.numMembers // if there's a conflict, just mark as ambiguous
            {
                outcome = nil
            } else {
                return nil
            }

            state.setResolved(result: outcome)

            return <-self.betTokenMinter.mint(outcome: outcome)
        }

        pub fun mintToken(address: Address): @AnyResource{ResolverInterfaces.Token} {
            return <-create UserToken(betId: self.betId, address: address)
        }

        destroy () {
            destroy self.betTokenMinter
        }
    }
}