import CloserInterfaces from "./CloserInterfaces.cdc"

pub contract AllBetsCloser {
    pub resource Closer: CloserInterfaces.Closer {
        priv var numMembers: Int
        priv var numBets: Int
        priv var isClosed: Bool

        init (numMembers: Int) {
            self.numMembers = numMembers
            self.numBets = 0
            self.isClosed = false
        }

        pub fun betMade(): Bool {
            self.numBets = self.numBets + 1
            if self.numBets == self.numMembers {
                self.isClosed = true
                return true
            }
            return false
        }

        pub fun checkClosed(): Bool {
            return self.isClosed
        }
    }

    pub fun create(numMembers: Int): @Closer {
        return <-create Closer(numMembers: numMembers)
    }
}