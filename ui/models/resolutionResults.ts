export default interface ResolutionResults {
    betId: string,
    numMembers: number,
    numVotes: number,
    usersVoted: string[],
    runningDecision: boolean | null,
    isDisputed: boolean
}