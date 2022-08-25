export default interface ResolverState {
    isResolved: boolean
    result?: boolean
    votes: { [key: string]: { address: string, vote?: boolean } }
}
