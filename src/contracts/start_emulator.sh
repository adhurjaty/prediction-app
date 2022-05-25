#/bin/bash

flow project deploy --network=emulator
# dan
flow accounts create --key 4e14e62df7e0422c8f3c13c9f55e63f7bb43fd713fbc6294955457ccfcb3aa21a3dcc6dde13685208686834dcd00e9acef032b73d4033a3f1bfac53ebdeb295a --signer delphai
# tony
flow accounts create --key 1f928fa6d8ed0723a8cd1f8dda5aef423453c3b6c4acbfad0f19f0d48ac7eeb7642817209c08e2c4313de516fe48c37169f47df4c9c6057c3ffe098819b2a282 --signer delphai
# anil
flow accounts create --key 47ea07ff0f8b71d3cfe669f6fb2b11a3d79e7ac900f4e0df7c9591d791408c270435655a49e550f484621da60e9b758b68c96f8087bc36c67f726e4a6e174919 --signer delphai

# setup test bets

flow transactions execute ./cadence/transactions/deployComposerBet.cdc 