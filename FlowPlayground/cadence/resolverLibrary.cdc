pub contract ResolverLibrary {
    pub struct interface YesNoResolver {
        pub fun getResult(): Bool?
        pub fun vote(vote: Bool)
    }

    pub struct MajorityYesNoResolver : YesNoResolver {
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

        pub fun vote(vote: Bool) {
            self.numVotes = self.numVotes + 1
            var numYesNoVotes = 0
            if vote {
                self.numYeses = self.numYeses + 1
                numYesNoVotes = self.numYeses
            } else {
                numYesNoVotes = self.numVotes - self.numYeses
            }
            if numYesNoVotes > (self.numMembers / 2) {
                self.result = vote
            }
        }
    }

    pub struct UnanimousYesNoResolver : YesNoResolver {
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

        pub fun vote(vote: Bool) {
            post {
                self.isDisputed: "Resolution is in dispute"
            }

            if self.runningDecision != nil && self.runningDecision != vote {
                self.isDisputed = true
                return
            }
            self.runningDecision = vote
            self.numVotes = self.numVotes + 1
            if self.numVotes == self.numMembers {
                self.result = vote
            }
        }
}
}