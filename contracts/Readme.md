# Bet contracts

## Class diagram

![class hierarchy](../../docs/Diagrams/out/Architecture/inheritanceDiagram.png)

I think this is as simple as we can make it. Each bet contract creates 2 classes: the bet and the resolver. We pass in the resolver type as an argument and the bet contract creates the resolver contract.