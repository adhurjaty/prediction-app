export default interface PayoutState {
    isResolved: boolean;
    payouts: { [key: string]: { address: string, amount: number, hasRetrieved: boolean } }
}
