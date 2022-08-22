import DelphaiResources from 0xdelphai
import BetInterfaces from 0xdelphai

transaction(delphai: Address, betId: String, address: Address) {
    let delphaiUser: &DelphaiResources.User

    prepare(acct: AuthAccount) {
        self.delphaiUser = acct.borrow<&DelphaiResources.User>(from: /storage/delphaiUser)
            ?? panic("Could not borrow DelphaiResources.User from storage")
    }

    execute {
        let pathName = BetInterfaces.betPathName(betId: betId)
        let betPublicPath = PublicPath(identifier: pathName)
            ?? panic("Invalid public path")
        let bet = getAccount(delphai)
            .getCapability(betPublicPath!)
            .borrow<&AnyResource{BetInterfaces.Bet}>()
            ?? panic("Could not borrow BetInterfaces.TokenMinter from public path")

        let receiver = getAccount(address)
            .getCapability<&AnyResource{BetInterfaces.Receiver}>(
                /public/delphaiBetTokenReceiver)!
            .borrow()
            ?? panic("Could not borrow BetInterfaces.BetTokenReceiver from public account")
        
        let accessToken <- self.delphaiUser.createToken(betId: betId)
        let results <-bet.mintToken(token: <-accessToken)

        receiver.deposit(token: <-results.getToken())

        destroy results
    }
}