export class Group {
    public name: string = '';

    constructor(init?: Partial<Group>) {
        Object.assign(this, init);
    }
}