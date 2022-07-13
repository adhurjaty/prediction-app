import DelphaiUsers from 0xdelphai

pub fun main(address: Address, betId: String): Bool {
    let acct = getAuthAccount(address)
    let delphaiUser = acct.borrow<&DelphaiUsers.DelphaiUser>(
            from: /storage/DelphaiUser)
            ?? panic("Could not get vault reference")
    return delphaiUser.resolutionTokenVault.hasToken(betId: betId)
}