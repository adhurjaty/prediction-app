import Bet from "@/models/bet";
import BetState from "@/models/betState";
import User from "@/models/user";
import Wager from "@/models/wager";
import { Typography } from "@mui/material";
import { ResultAsync } from "neverthrow";
import BetStateTable from "./betStateTable";
import PlaceWagerForm from "./placeWagerForm";

interface Props {
    users: User[],
    userAddress: string,
    bet: Bet,
    betState: BetState,
    onSubmit: (wager: Wager) => ResultAsync<any, string>
}

export default function WagerSection({ users, userAddress, bet, betState, onSubmit }: Props) {
    const userWager = betState.wagers.get(userAddress);
    const isResolved = betState.isResolved;

    return (
        <>
            {!isResolved && <BetStateTable users={users} betState={betState} />}
            {isResolved &&
                <></>
            || userWager &&
                <Typography variant="h6">
                    You have already made a wager for this bet
                </Typography>
            ||
                <PlaceWagerForm
                    betId={bet.id}
                    userAddress={userAddress}
                    onSubmit={onSubmit}
                />
            }
        </>
    );
}