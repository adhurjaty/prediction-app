import DelphaiResources from 0xdelphai
import PayoutInterfaces from 0xdelphai

transaction(delphai: Address, betId: String, address: Address) {
    let delphaiUser: &DelphaiResources.User

    prepare(acct: AuthAccount) {
        self.delphaiUser = acct.borrow<&DelphaiResources.User>(from: /storage/delphaiUser)
            ?? panic("Could not borrow DelphaiResources.User from storage")
    }

    execute {
        let pathName = PayoutInterfaces.payoutPathName(betId: betId)
        let payoutPublicPath = PublicPath(identifier: pathName)
            ?? panic("Invalid public path")
        let payout = getAccount(delphai)
            .getCapability(payoutPublicPath!)
            .borrow<&AnyResource{PayoutInterfaces.Payout}>()
            ?? panic("Could not borrow PayoutInterfaces.TokenMinter from public path")

        let receiver = getAccount(address)
            .getCapability<&AnyResource{PayoutInterfaces.Receiver}>(
                /public/delphaiPayoutTokenReceiver)!
            .borrow()
            ?? panic("Could not borrow PayoutInterfaces.PayoutTokenReceiver from public account")
        
        let accessToken <- self.delphaiUser.createToken(betId: betId)
        let results <-payout.mintToken(token: <-accessToken)

        receiver.deposit(token: <-results.getToken())

        destroy results
    }
}