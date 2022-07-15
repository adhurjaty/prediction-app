import Bet from "./bet";
import User from "./user";

export default interface Group {
    id: string,
    name: string,
    accuracy?: number,
    bets: Bet[],
    color?: string,
    users: User[]
}