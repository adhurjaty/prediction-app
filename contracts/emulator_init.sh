#/bin/bash

flow project deploy --network=emulator

pushd ../api/Scripts
dotnet run
popd

flow dev-wallet -f wallet_flow.json --emulator-host http://localhost:8888
# flow dev-wallet -f wallet_flow.json