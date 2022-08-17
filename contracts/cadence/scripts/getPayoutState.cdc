import PayoutInterfaces from 0xdelphai

pub fun main(delphai: Address, betId: String): PayoutInterfaces.State {
    let pathName = PayoutInterfaces.payoutPathName(betId: betId)
    let payoutPublicPath = PublicPath(identifier: pathName)
        ?? panic("Invalid public path")

    let payoutRef = getAccount(delphai)
        .getCapability<&AnyResource{PayoutInterfaces.Payout}>(payoutPublicPath)
        .borrow()
        ?? panic("Could not borrow payout reference")

    return payoutRef.state
}