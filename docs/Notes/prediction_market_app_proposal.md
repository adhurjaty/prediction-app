# Fantasy Prediction App (rename soon)

## Summary

Fantasy Prediction is a mobile app that allows users to enter into a private prediction market with friends. User would create an account, create a group and add their friends, and add prediction propositions to the table. The people in the group can make wagers on the propositions, and the payout would be split amongst the members of the group that were correct.

This would use Smart Contracts written in Solidity to handle the trust issues.

## Betting

Any member, or just an admin, can add propositions to the table. Anyone can then place a wager in Ethereum or value-less token (Token). When the proposition has resolved, then a payout is made in Token.

## Adding Propositions

The user adding the proposition would be able to select one from a list populated by a 3rd party prediction market API. He could also make their own custom proposition.

3rd party propositions resolve on their own, based on the API. Custom propositions are resolved by some consensus mechanism (majority, unanimity, some reputation-based thing?).

### Placing a wager and payout

Group admins can choose whether their group is playing for money or for pride (Ethereum vs. value-less token). All the money/tokens stay within the pool for a given bet -- it only moves to different people within the group.

Ideas for placing a wager:

- All bets are of the same amount, but the user can set their confidence percentage (like [Metaculus](https://www.metaculus.com/questions/)). Payout would be based on how correct (or incorrect) you were when the proposition resolved
- Members of a group can sell shares of 'yes' or 'no' at some price <= $1 to other members of the group. When the proposition resolves yes, all the yes shares are converted to $1 (like [PredictIt](https://www.predictit.org/)).
  - Would be interesting to allow for limit buys and sells, options and other stock market ideas
  - Could look at other auction market ideas (ebay-style, [Milgrom](https://news.stanford.edu/2020/11/19/bid-picture-nobel-prize-winners-explain-auction-theory-collaboration/#:~:text=If%20designed%20correctly%2C%20auctions%20can,inventions%20of%20new%20auction%20formats.))

## Disputes

3rd party propositions have no capacity to dispute - it's up to the 3rd party. Disputes can only occur on custom propositions.

A dispute occurs when the consensus mechanism fails (no majority agrees, not unanimous, etc.). Smart contracts are built to handle disputes, so there are a few options of how to deal with this. We can devise a default smart contract that can be replaced by a user's preferred contract.

Ideas for handling disputes:

- Void the bet -- everyone gets their money back
- Penalize the group -- user can set whether we pocket the penalty money or if it goes to one of a list of charities of our choosing.

## Components

- Mobile UI
  - PWA
  - cross-platform library (React-Native, Vue-Native)
  - native app (Kotlin, Swift)
- API Backend
  - Persistent storage
    - Users, groups, propositions, etc.
  - 3rd party API access
- Rules
  - Solidity part (don't know much now)


## Random ideas

- Could allow for 1-on-1 bets. Benefit over something like just venmo or splitwise is there would be better recourse in the case of a dispute
