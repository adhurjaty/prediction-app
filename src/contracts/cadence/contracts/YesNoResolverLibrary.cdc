pub contract YesNoResolverLibrary {
    pub let yesNoVoteMinterStoragePath: StoragePath

    pub resource YesNoVote {
        pub let betId: String
        pub let userAddress: Address
        pub var resolution: Bool?
        
        init (betId: String, userAddress: Address) {
            self.betId = betId
            self.userAddress = userAddress
            self.resolution = nil
        }

        pub fun vote(resolution: Bool) {
            self.resolution = resolution
        }
    }

    pub resource interface YesNoVoteReceiver {
        pub fun receive(token: @YesNoVote)
    }

    pub resource YesNoVoteVault: YesNoVoteReceiver {
        priv var tokens: @[YesNoVote]

        init () {
            self.tokens <- []
        }

        pub fun receive(token: @YesNoVote) {
            post {
                self.tokens.length == 1 : "Token already exists in vault"
            }
            self.tokens.append(<-token)
        }

        pub fun withdraw(): @YesNoVote {
            pre {
                self.tokens.length == 1 : "No token exists in vault"
            }
            return <- self.tokens.remove(at: 0)
        }

        destroy () {
            destroy self.tokens
        }
    }

    pub resource YesNoVoteTokenMinter {
        pub fun createToken(betId: String, address: Address): @YesNoVote {
            return <-create YesNoVote(betId: betId, userAddress: address)
        }
    }


    pub resource interface YesNoResolver {
        pub fun getResult(): Bool?
        pub fun vote(vote: @YesNoVote)
    }

    pub resource MajorityYesNoResolver : YesNoResolver {
        priv var result: Bool?
        priv let numMembers: Int
        priv var numYeses: Int
        priv var numVotes: Int
    
        init (numMembers: Int) {
            self.result = nil
            self.numMembers = numMembers
            self.numYeses = 0
            self.numVotes = 0
        }

        pub fun getResult(): Bool? {
            return self.result
        }

        pub fun vote(vote: @YesNoVote) {
            self.numVotes = self.numVotes + 1
            var numYesNoVotes: Int = 0
            let voteBool = vote.resolution
                ?? panic("Resolution vote has not been cast")
            if voteBool {
                self.numYeses = self.numYeses + 1
                numYesNoVotes = self.numYeses
            } else {
                numYesNoVotes = self.numVotes - self.numYeses
            }
            if numYesNoVotes > (self.numMembers / 2) {
                self.result = voteBool
            }
            destroy vote
        }
    }

    pub resource UnanimousYesNoResolver : YesNoResolver {
        priv var result: Bool?
        priv var runningDecision: Bool?
        priv var isDisputed: Bool
        priv var numVotes: Int
        priv let numMembers: Int

        init (numMembers: Int) {
            self.result = nil
            self.runningDecision = nil
            self.isDisputed = false
            self.numVotes = 0
            self.numMembers = numMembers
        }
    
        pub fun getResult(): Bool? {
            return self.result
        }

        pub fun vote(vote: @YesNoVote) {
            post {
                self.isDisputed: "Resolution is in dispute"
            }

            let voteBool = vote.resolution
                ?? panic("Resolution vote has not been cast")
            if self.runningDecision != nil && self.runningDecision != voteBool {
                self.isDisputed = true
                destroy vote
                return
            }
            self.runningDecision = voteBool
            self.numVotes = self.numVotes + 1
            if self.numVotes == self.numMembers {
                self.result = voteBool
            }
            destroy vote
        }
    }

    init () {
        self.yesNoVoteMinterStoragePath = /storage/YesNoVoteMinter
        self.account.save(<-create YesNoVoteTokenMinter(),
            to: self.yesNoVoteMinterStoragePath)
    }
}