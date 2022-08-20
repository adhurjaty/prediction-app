pub contract DelphaiResources {
    pub resource Token {
        pub let betId: String
        pub let address: Address

        init(betId: String, address: Address) {
            self.betId = betId
            self.address = address
        }
    }

    pub resource User {
        pub fun createToken(betId: String): @Token {
            return <-create Token(betId: betId, address: self.owner!.address)
        }
    }

    pub fun createUser(): @User {
        return <-create User()
    }
}