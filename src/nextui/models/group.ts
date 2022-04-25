import User from "./user";

export interface Group {
    id: string,
    name: string,
    accuracy?: number,
    betsMade: number,
    betsAvailable?: number,
    color?: string,
    users: User[]
}