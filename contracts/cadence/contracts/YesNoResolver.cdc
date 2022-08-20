import DelphaiResources from "./DelphaiResources.cdc"
import ResolverInterfaces from "./ResolverInterfaces.cdc"

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

    pub resource MintResults: ResolverInterfaces.MintResults {
        priv let delphaiToken: @[DelphaiResources.Token]
        priv let token: @[UserToken]

        init(delphaiToken: @DelphaiResources.Token, token: @UserToken) {
            self.delphaiToken <- [<-delphaiToken]
            self.token <- [<-token]
        }

        pub fun getDelphaiToken(): @DelphaiResources.Token {
            return <-self.delphaiToken.remove(at: 0)
        }

        pub fun getToken(): @AnyResource{ResolverInterfaces.Token} {
            return <-self.token.remove(at: 0)
        }

        destroy () {
            destroy self.delphaiToken
            destroy self.token
        }
    }

    pub struct Result: ResolverInterfaces.Result {
        pub let outcome: Bool?

        init(outcome: Bool?) {
            self.outcome = outcome
        }
    }

    pub resource MajorityResolver: ResolverInterfaces.Resolver {
        pub let betId: String
        pub let state: AnyStruct{ResolverInterfaces.State}
        pub let numMembers: Int

        init(betId: String, numMembers: Int) {
            self.betId = betId
            self.numMembers = numMembers
            self.state = State()
        }

        pub fun mintToken(token: @DelphaiResources.Token): @AnyResource{ResolverInterfaces.MintResults} {
            let address = token.address
            return <-create MintResults(
                delphaiToken: <-token,
                token: <-create UserToken(betId: self.betId, address: address),
            )
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

        pub fun resolve(): AnyStruct{ResolverInterfaces.Result}? {
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

            return Result(outcome: outcome)
        }
    }

    pub fun createMajorityResolver(betId: String, numMembers: Int): @MajorityResolver {
        return <-create MajorityResolver(betId: betId, numMembers: numMembers)
    }
}