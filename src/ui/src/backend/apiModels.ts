export class User {
    public id = '';
    public displayName = '';
    public email = '';
    public friends: User[] = [];
    public mainnetAddress = '';
    public prestigeAddress = '';
    public prestigePrivateKey = '';

    constructor(init?: Partial<Group>) {
        Object.assign(this, init);
    }
}

export class Group {
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