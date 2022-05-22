#/bin/bash

flow project deploy --network=emulator &

# setup test bets

flow transactions execute ./cadence/transactions/deployComposerBet.cdc 