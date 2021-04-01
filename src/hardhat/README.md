## Building

### Hardhat server

```
docker build -f Dockerfile.server -t bwf/hardhat-server:latest .
```

## Client 

*client doesn't work yet, though build works*

```
docker build -f Dockerfile.client -t bwf/hardhat-client:latest .
```

## Running

### Start the Hardhat server

This starts up the Hardhat server and exposes it on TCP port 8545:

`docker run -p 8545:8545/tcp --name bwfhardhat -it bwf/hardhat-server:latest`

### Explore and run scripts/tests

Open a shell on the Hardhat server

`docker exec -it bwfhardhat /bin/bash`

Explore!


```bash
root@268831bf861d:/usr/app# npx hardhat test


  Proposition
    1) Should allow a member to place a bet
    ✓ Should revert a bet from a non-member (76ms)


  1 passing (1s)
  1 failing

  1) Proposition
       Should allow a member to place a bet:
     AssertionError: Waffle's calledOnContract is not supported by Hardhat
      at Proxy.<anonymous> (node_modules/@nomiclabs/hardhat-waffle/src/waffle-chai.ts:67:11)
      at Proxy.methodWrapper (node_modules/chai/lib/chai/utils/addMethod.js:57:25)
      at Context.<anonymous> (test/Proposition.js:47:28)
      at processTicksAndRejections (node:internal/process/task_queues:94:5)
```

```bash
root@f380d27ab980:/usr/app# npx hardhat run --network localhost scripts/sample-script.js
Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account balance: 9999996920240000000000
Proposition deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
Wager pool before bet: BigNumber { _hex: '0x00', _isBigNumber: true }
Wager pool before bet: BigNumber { _hex: '0x00', _isBigNumber: true }
My wager: BigNumber { _hex: '0x00', _isBigNumber: true }
Wager pool after bet: BigNumber { _hex: '0x03e8', _isBigNumber: true }
Wager pool after bet: BigNumber { _hex: '0x03e8', _isBigNumber: true }
My wager: BigNumber { _hex: '0x03e8', _isBigNumber: true }
```

```bash
root@f380d27ab980:/usr/app# npx hardhat accounts
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
0x90F79bf6EB2c4f870365E785982E1f101E93b906
0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc
0x976EA74026E726554dB657fA54763abd0C3a0aa9
0x14dC79964da2C08b23698B3D3cc7Ca32193d9955
0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f
0xa0Ee7A142d267C1f36714E4a8F75612F20a79720
0xBcd4042DE499D14e55001CcbB24a551F3b954096
0x71bE63f3384f5fb98995898A86B02Fb2426c5788
0xFABB0ac9d68B0B445fB7357272Ff202C5651694a
0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec
0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097
0xcd3B766CCDd6AE721141F452C550Ca635964ce71
0x2546BcD3c84621e976D8185a91A922aE77ECEc30
0xbDA5747bFD65F08deb54cb465eB87D40e51B197E
0xdD2FD4581271e230360230F9337D5c0430Bf44C0
0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199
```

## Building with Waffle

```
npm run build
cd testwaffle; tsc --resolveJsonModule; cd ..
npm run waffletest
```