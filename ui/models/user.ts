export default interface User {
    id: string,
    displayName: string,
    email: string,
    friends: User[],
    mainnetAddress: string,
    prestigeAddress: string,
    prestigePrivateKey: string
}