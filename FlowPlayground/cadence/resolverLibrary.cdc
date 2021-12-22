pub contract ResolverLibrary {
    pub resource YesNoVote {
        pub var resolution: Bool?

        init () {
            self.resolution = nil
        }

        pub fun setResolved(resolution: Bool) {
            self.resolution = resolution
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
            var numYesNoVotes = 0
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

    pub fun createMajorityYesNoResolver(numMembers: Int): @MajorityYesNoResolver {
        return <-create MajorityYesNoResolver(numMembers: numMembers)
    }

    pub fun createUnanimousYesNoResolver(numMembers: Int): @UnanimousYesNoResolver {
        return <-create UnanimousYesNoResolver(numMembers: numMembers)
    }
}