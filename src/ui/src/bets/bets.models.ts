import { Group } from "@/groups/models";

export interface Bet {
    id: string,
    type: string,
    title: string,
    description: string,
    closeDate: Date,
    amount: number,
    group?: Group
}

export interface EventBet extends Bet {
    resolutionDescription: string 
}

export interface DateBet extends Bet {
    resolveDate: Date
}