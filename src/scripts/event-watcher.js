const { ethers } = require("ethers");


async function main() {

    const provider = new ethers.getDefaultProvider("http://localhost:8545");

    // filter = {
    //     address: null,
    //     topics: [
    //         ethers.utils.id("VoteRecorded(address,string,bytes32)"),
    //         ethers.utils.id("VoteCount(uint256,uint256)")
    //     ]
    // }

    topicVoteRecorded = [
        ethers.utils.id("VoteRecorded(address,string,bytes32)"), // 5c816d06f8f1bd89fdffe48bd51f5a428eb7bc948f30d5996d2075a715d686dc
    ]

    topicVoteCount = [
        ethers.utils.id("VoteCount(uint256,uint256)") // 13cbe618ace9cb5c298a4d2858b8cc4ed33766a32ad48e009363cee124b48191
    ]

    provider.on(topicVoteRecorded, (log, event) => {
        console.log("Vote Recorded");
    })

    provider.on(topicVoteCount, (log, event) => {
        console.log("Vote Count");
    })

    // provider.on("pending", (tx) => {
    //     console.log("Pending...");
    // })
}

if (require.main === module) {
    main();
}