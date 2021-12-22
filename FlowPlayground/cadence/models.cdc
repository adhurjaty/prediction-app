pub contract Models {
    pub struct Group {
        pub let id: String
        pub let members: [Address]
        pub let account: AuthAccount

        init (id: String, members: [Address], account: AuthAccount) {
            self.id = id
            self.members = members
            self.account = account
        }
    }
}