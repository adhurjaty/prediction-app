import { Group } from "@/groups/models";

export interface Bet {
    id: string,
    type: string,
    title: string,
    description: string,
    closeTime: Date,
    amount: number
}

export interface EventBet extends Bet {
    resolutionDescription: string 
}

export interface DateBet extends Bet {
    resolveDate: Date
}

export interface Wager {
    betId: string,
    userId: string,
    prediction: boolean,
    wager: number
}

export interface Resolution {
    betId: string,
    userId: string,
    vote: boolean
}

export interface ResolutionResults {
    betId: string,
    numMembers: number,
    numVotes: number,
    runningDecision: boolean | null,
    isDisputed: boolean
}