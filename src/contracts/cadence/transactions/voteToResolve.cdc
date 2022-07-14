import BetContractComposer from 0xdelphai
import DelphaiUsers from 0xdelphai
import YesNoResolverLibrary from 0xdelphai

transaction(delphai: Address, betId: String, prediction: Bool) {
    let delphaiUser: &DelphaiUsers.DelphaiUser

    prepare(acct: AuthAccount) {
        self.delphaiUser = acct.borrow<&DelphaiUsers.DelphaiUser>(
            from: /storage/DelphaiUser)
            ?? panic("Could not get vault reference")
    }

    execute {
        let resolutionToken <- self.delphaiUser.resolutionTokenVault.withdraw(betId: betId) 
            as! @YesNoResolverLibrary.YesNoResolutionToken

        resolutionToken.vote(resolution: prediction)

        let betPath = PublicPath(identifier: betId)
        let composerRef = getAccount(delphai)
            .getCapability<&BetContractComposer.ContractComposer>(betPath!)!
            .borrow()
            ?? panic("Could not get bet composer")
        composerRef.voteToResolve(vote: <-resolutionToken)
    }
}
