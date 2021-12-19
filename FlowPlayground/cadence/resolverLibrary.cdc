pub contract ResolverLibrary {
    pub resource interface YesNoResolver {
        pub fun getResult(): Bool?
        pub fun vote(isYes: Bool)
    }

    pub resource MajorityYesNoResolver : YesNoResolver {
        priv let result: Bool?
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

        pub fun vote(isYes: Bool) {
            self.numVotes = self.numVotes + 1
            if isYes {
                self.numYeses = self.numYeses + 1

                if self.numYeses > (self.)
            }
        }
    }
}