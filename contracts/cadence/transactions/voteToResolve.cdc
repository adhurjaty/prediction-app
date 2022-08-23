import ResolverInterfaces from 0xdelphai
import YesNoResolver from 0xdelphai
import Composer from 0xdelphai

transaction(delphai: Address, betId: String, vote: Bool?) {
    let token: @AnyResource{ResolverInterfaces.Token}
    
    prepare(acct: AuthAccount) {
        let tokenVault = acct
            .borrow<&ResolverInterfaces.Vault>(from: /storage/delphaiResolverTokenVault)
            ?? panic("Could not borrow token vault")
        self.token <- tokenVault.withdraw(betId: betId)
    }

    execute {
        let pathName = Composer.composerPathName(betId: betId)
        let publicPath = PublicPath(identifier: pathName)
            ?? panic("Invalid public path")
        let composer = getAccount(delphai)
            .getCapability<&AnyResource{Composer.PublicComposer}>(publicPath!)
            .borrow()
            ?? panic("Could not borrow composer capability")

        let yesNoToken <- self.token as! @YesNoResolver.UserToken

        yesNoToken.setVote(vote: vote)
        composer.castVote(token: <-yesNoToken)
    }
}