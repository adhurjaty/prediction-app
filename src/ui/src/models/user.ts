export default class User {
    public id = '';
    public displayName = '';
    public email = '';
    public friends: User[] = [];
    public mainnetAddress = '';
    public prestigeAddress = '';
    public prestigePrivateKey = '';

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
}