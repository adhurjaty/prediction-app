export default interface PayoutState {
    isResolved: boolean
    payouts: Map<string, { address: string, amount: number, hasRetrieved: boolean }>
}
