import CloserInterfaces from 0xdelphai
import AllBetsCloser from 0xdelphai

transaction(betId: String, numMembers: Int) {

    prepare(acct: AuthAccount) {
        let closerResource <- AllBetsCloser.create(numMembers: numMembers)
        
        let pathName = CloserInterfaces.closerPathName(betId: betId)
        let closerStoragePath = StoragePath(identifier: pathName)
            ?? panic("Invalid storage path")
        let closerPrivatePath = PrivatePath(identifier: pathName)
            ?? panic("Invalid private path")

        acct.save(<-closerResource, to: closerStoragePath!)
        acct.link<&AnyResource{CloserInterfaces.Closer}>(
            closerPrivatePath, target: closerStoragePath!)
    }
}