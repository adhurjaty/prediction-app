import ResolverInterfaces from 0xdelphai
import YesNoResolver from 0xdelphai

transaction(betId: String, numMembers: Int) {

    prepare(acct: AuthAccount) {
        let resolverResource <- YesNoResolver.createMajorityResolver(betId: betId, 
            numMembers: numMembers)
        
        let pathName = ResolverInterfaces.resolverPathName(betId: betId)
        let resolverStoragePath = StoragePath(identifier: pathName)
            ?? panic("Invalid storage path")
        let resolverPublicPath = PublicPath(identifier: pathName)
            ?? panic("Invalid public path")

        acct.save(<-resolverResource, to: resolverStoragePath!)
        acct.link<&AnyResource{ResolverInterfaces.Resolver}>(
            resolverPublicPath, target: resolverStoragePath!)
    }
}