import DelphaiUsers from 0xdelphai

transaction {
    prepare(signer: AuthAccount) { 
        log(signer.address) 
    }
}