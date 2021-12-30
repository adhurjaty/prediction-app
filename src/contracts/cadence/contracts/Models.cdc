pub contract Models {
    pub struct Group {
        pub let id: String
        pub let members: [Address]

        init (id: String, members: [Address]) {
            self.id = id
            self.members = members
        }
    }
}