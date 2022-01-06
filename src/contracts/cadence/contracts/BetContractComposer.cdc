
pub contract BetContractComposer {
    pub let adminStoragePath: StoragePath

    

    

    
    

    pub resource DummyYesNoBet {
        priv let madeBets: @{Address: YesNoBet}

        init (numMembers: Int) {
            var n = numMembers
            self.madeBets <- {}
        }

        pub fun makeBet(acct: AuthAccount, bet: @YesNoBet) {
            log("bet made")
            self.madeBets[acct.address] <-! bet
        }

        destroy () {
            destroy self.madeBets
        }
    }

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

        init (numVoters: Int) {
            var n = numVoters
            self.initVotes <- []
            while n > 0 {
                self.initVotes.append(<-create YesNoVote())
                n = n - 1
            }
        }

        pub fun withdrawVote(): @YesNoVote {
            return <-self.initVotes.removeFirst()
        }
        
        destroy() {
            destroy self.initVotes
        }
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

    pub resource ContractComposer {

        priv let resolver: @AnyResource{YesNoResolver}
        priv let bet: @DummyYesNoBet

        init (numMembers: Int) {
            self.resolver <-create MajorityYesNoResolver(numMembers: numMembers)
            self.bet <-create DummyYesNoBet(numMembers: numMembers)
        }

        pub fun makeBet(acct: AuthAccount, bet: @YesNoBet) {
            self.bet.makeBet(acct: acct, bet: <-bet)
        }

        pub fun voteToResolve(vote: @YesNoVote) {
            self.resolver.vote(vote: <-vote)
        }

        pub fun getResult(): Bool? {
            return self.resolver.getResult()
        }

        destroy() {
            destroy self.resolver
            destroy self.bet
        }
    }

    pub resource Administrator {
        init() {

        }

        pub fun deployContractComposer(betId: String, admin: AuthAccount, members: [Address]) {
            let contract <-create ContractComposer(numMembers: members.length)

            let savePath = BetContractComposer.getDeploymentStoragePath(betId: betId)
            let publicPath = BetContractComposer.getDeploymentPublicPath(betId: betId)

            admin.save(<-contract, to: savePath)
            admin.link<&BetContractComposer.ContractComposer>(publicPath, target: savePath)

            self.addMembers(betId: betId, admin: admin, members: members)
        }

        priv fun addMembers(betId: String, admin: AuthAccount, members: [Address]) {
            let tokenBank <-create YesNoBetBank()
            for member in members {
                tokenBank.addMember(member: member)
            }

            let savePath = self.getYesNoBetStoragePath(betId: betId)
            admin.save(<-tokenBank, to: savePath)
        }

        priv fun saveYesNoBet(betId: String, admin: AuthAccount, member: Address) {
            var betStoragePath = self.getYesNoBetStoragePath(betId: betId)
            admin.save(<-create YesNoBet(address: member), to: betStoragePath)
        }

        priv fun getYesNoBetStoragePath(betId: String): StoragePath {
            return /storage/betId1234YesNoBet
            // return StoragePath(identifier: betId.concat("/YesNoBet"))
        }

        pub fun withdrawBetToken(betId: String, admin: AuthAccount, member: Address): @YesNoBet {
            let bankCapabiliy = admin.borrow<&BetContractComposer.YesNoBetBank>(
                from: self.getYesNoBetStoragePath(betId: betId))!
            return <-bankCapabiliy.withdrawToken(address: member)
        }
    }

    pub init() {
        self.adminStoragePath = /storage/composerAdmin
        let admin <-create Administrator()
        self.account.save(<-admin, to: self.adminStoragePath)
    }

    pub fun getDeploymentStoragePath(betId: String): StoragePath {
        return /storage/betId1234
        // return StoragePath(identifier: betId)
    }

    pub fun getDeploymentPublicPath(betId: String): PublicPath {
        return /public/betId1234
        // return PublicPath(identifier: betId)
    }

}
 