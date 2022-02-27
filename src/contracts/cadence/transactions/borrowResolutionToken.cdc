import DelphaiUsers from 0xdelphai
import YesNoResolverLibrary from 0xdelphai

transaction(betId: String) {
    let delphaiUser: &DelphaiUsers.DelphaiUser

    prepare(acct: AuthAccount) {
        self.delphaiUser = acct.borrow<&DelphaiUsers.DelphaiUser>(
            from: /storage/DelphaiUser)
            ?? panic("Could not get vault reference")
    }

    execute {
        let resolutionToken <- self.delphaiUser.resolutionTokenVault.withdraw(betId: betId) 
            as! @YesNoResolverLibrary.YesNoResolutionToken
        self.delphaiUser.resolutionTokenVault.deposit(token: <-resolutionToken)
    }
}