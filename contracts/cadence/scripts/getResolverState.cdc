import ResolverInterfaces from 0xdelphai

pub fun main(delphai: Address, betId: String): AnyStruct{ResolverInterfaces.State} {
    let pathName = ResolverInterfaces.resolverPathName(betId: betId)
    let resolverPublicPath = PublicPath(identifier: pathName)
        ?? panic("Invalid public path")

    let resolverRef = getAccount(delphai)
        .getCapability<&AnyResource{ResolverInterfaces.Resolver}>(resolverPublicPath)
        .borrow()
        ?? panic("Could not borrow resolver reference")

    return resolverRef.state
}