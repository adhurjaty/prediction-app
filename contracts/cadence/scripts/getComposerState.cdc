import Composer from 0xdelphai

pub fun main(delphai: Address, betId: String): Composer.State {
    let pathName = Composer.composerPathName(betId: betId)
    let publicPath = PublicPath(identifier: pathName)
        ?? panic("Invalid public path")
    let composer = getAccount(delphai)
        .getCapability<&AnyResource{Composer.PublicComposer}>(publicPath!)
        .borrow()
        ?? panic("Could not borrow composer capability")

    return composer.getState();
}