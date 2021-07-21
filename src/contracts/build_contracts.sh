#/bin/sh

cd `dirname $0`
solc --combined-json abi,bin --output-dir ../build/contracts Bet.sol