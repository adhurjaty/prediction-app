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

    pub resource BaseYesNoResolver {
        priv let initVotes: @[YesNoVote]

        init (numVoters: UInt) {
            var n = numVoters
            self.initVotes <- []
            while n > 0 {
                self.initVotes.append(<-create YesNoVote())
                n = n - 1
            }
        }

        access(account) fun withdrawVote(): @YesNoVote {
            return <-self.initVotes.removeFirst()
        }
        
        destroy() {
            destroy self.initVotes
        }
    }

    pub resource MajorityYesNoResolver : YesNoResolver {
        priv var result: Bool?
        priv let numMembers: UInt
        priv var numYeses: UInt
        priv var numVotes: UInt
    
        init (numMembers: UInt) {
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
            var numYesNoVotes: UInt = 0
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
        priv var numVotes: UInt
        priv let numMembers: UInt

        init (numMembers: UInt) {
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

    pub fun createMajorityYesNoResolver(numMembers: UInt): @MajorityYesNoResolver {
        return <-create MajorityYesNoResolver(numMembers: numMembers)
    }

    pub fun createUnanimousYesNoResolver(numMembers: UInt): @UnanimousYesNoResolver {
        return <-create UnanimousYesNoResolver(numMembers: numMembers)
    }
}
 