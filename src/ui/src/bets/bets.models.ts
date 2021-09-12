
export interface Bet {
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