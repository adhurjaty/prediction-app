export default interface BetState {
    isResolved: boolean
    wagers: Map<string, { address: string, amount: number, bet: boolean }>
}
