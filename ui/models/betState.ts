export default interface BetState {
    isClosed: boolean
    isResolved: boolean
    wagers: { [key: string]: { address: string, amount: number, bet: boolean } }
}
