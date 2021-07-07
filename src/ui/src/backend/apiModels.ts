export class Group {
    public id: string = '';
    public name: string = '';
    public accuracy?: number;
    public betsMade: number = 0;
    public betsAvailable?: number;
    public color?: string;

    constructor(init?: Partial<Group>) {
        Object.assign(this, init);
    }
}