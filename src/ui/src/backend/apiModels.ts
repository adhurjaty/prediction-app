export class Group {
    public name: string = '';
    public accuracy?: number;
    public betsMade: number = 0;

    constructor(init?: Partial<Group>) {
        Object.assign(this, init);
    }
}