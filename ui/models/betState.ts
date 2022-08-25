export default interface BetState {
    isResolved: boolean
    wagers: { [key: string]: { address: string, amount: number, bet: boolean } }
}
