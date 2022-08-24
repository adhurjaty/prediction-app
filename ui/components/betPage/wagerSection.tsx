import Bet from "@/models/bet";
import BetState from "@/models/betState";
import User from "@/models/user";
import { Typography } from "@mui/material";
import PlaceWagerForm from "./placeWagerForm";

interface Props {
    user: User,
    bet: Bet,
    betState: BetState
}

export default function WagerSection({ user, bet, betState }: Props) {
    const userWager = betState.wagers.get(user.mainnetAddress);

    if (userWager) {
        return (
            <Typography variant="h6">
                You have already made a wager for this bet
            </Typography>
        );
    }
    return <PlaceWagerForm
        delphai={delphai}
        betId={bet?.id || ''}
        userAddress={user?.mainnetAddress || ''}
        betState={composerState}
        onSubmit={() => router.reload()}
    />;
}