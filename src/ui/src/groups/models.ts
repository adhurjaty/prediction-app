import User from "../models/user";

export default class Group {
    public id: string = '';
    public name: string = '';
    public accuracy?: number;
    public betsMade: number = 0;
    public betsAvailable?: number;
    public color?: string;
    public users: User[] = [];

    constructor(init?: Partial<Group>) {
        Object.assign(this, init);
    }
}