export default interface ResolutionResults {
    betId: string,
    numMembers: number,
    numVotes: number,
    runningDecision: boolean | null,
    isDisputed: boolean
}