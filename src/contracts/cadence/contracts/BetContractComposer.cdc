import YesNoBetLibrary, YesNoResolverLibrary from 0xdelphai

pub contract BetContractComposer {
    pub let adminStoragePath: StoragePath

    pub resource ContractComposer {

        priv let resolver: @AnyResource{YesNoResolverLibrary.YesNoResolver}
        priv let bet: @YesNoBetLibrary.DummyYesNoBet

        init (numMembers: Int) {
            self.resolver <-createMajorityYesNoResolver(numMembers: numMembers)
            self.bet <-createDummyYesNoBet(numMembers: numMembers)
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
 