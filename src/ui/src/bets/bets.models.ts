
export interface Bet {
    id: string,
    type: string,
    title: string,
    description: string,
    closeDate: Date,
    amount: number
}

export interface EventBet extends Bet {
    resolutionDescription: string 
}

export interface DateBet extends Bet {
    resolveDate: Date
}