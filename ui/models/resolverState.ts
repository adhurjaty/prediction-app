export default interface ResolverState {
    isResolved: boolean
    result?: boolean
    votes: Map<string, { address: string, vote?: boolean }>
}
