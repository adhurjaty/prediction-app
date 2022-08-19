import BetInterfaces from 0xdelphai

pub fun main(delphai: Address, betId: String): AnyStruct{BetInterfaces.State} {
    let pathName = BetInterfaces.betPathName(betId: betId)
    let betPublicPath = PublicPath(identifier: pathName)
        ?? panic("Invalid public path")

    let betRef = getAccount(delphai)
        .getCapability<&AnyResource{BetInterfaces.Bet}>(betPublicPath)
        .borrow()
        ?? panic("Could not borrow bet reference")

    return betRef.state
}