#/bin/bash

flow project deploy --network=emulator

pushd ../api/Scripts
dotnet run
popd