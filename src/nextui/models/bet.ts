export default interface Bet {
    id: string,
    groupId: string,
    type: string,
    title: string,
    description: string,
    closeTime: Date,
    amount: number
}