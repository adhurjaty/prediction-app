import DelphaiUsers from 0xdelphai

pub contract YesNoResolverLibrary {
    pub let yesNoResolutionMinterStoragePath: StoragePath

    pub resource YesNoResolutionToken: DelphaiUsers.ResolutionToken {
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

    pub resource YesNoResolutionTokenMinter {
        pub fun createToken(betId: String, address: Address): @YesNoResolutionToken {
            return <-create YesNoResolutionToken(betId: betId, userAddress: address)
        }
    }

    pub resource interface YesNoResolver {
        pub fun getResult(): Bool?
        pub fun vote(vote: @YesNoResolutionToken)
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

        pub fun vote(vote: @YesNoResolutionToken) {
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

        pub fun vote(vote: @YesNoResolutionToken) {
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
        self.yesNoResolutionMinterStoragePath = /storage/YesNoVoteMinter
        self.account.save(<-create YesNoResolutionTokenMinter(),
            to: self.yesNoResolutionMinterStoragePath)
    }
}