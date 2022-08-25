import ComposerState from "@/models/composerState";
import { Typography } from "@mui/material";
import PlaceResolutionForm from "./placeResolutionForm";

interface Props {
    userAddress: string
    composerState: ComposerState
}

export default function ResolverSection({ userAddress, composerState }: Props) {
    // const isBetClosed = !!bet && bet.closeTime.getTime() < Date.now();
    // if (!isBetClosed) {
    //     return (
    //         <Typography variant="h6">
    //             Bet is not closed yet
    //         </Typography>
    //     );
    // }

    const { betState, resolverState } = composerState;

    const userVote = resolverState.votes.get(userAddress);

    if (userVote) {
        return (
            <Typography variant="h6">
                You have already voted to resolve this bet
            </Typography>
        )
    }
    
    return <PlaceResolutionForm
        delphai={delphai}
        betId={bet?.id || ''}
        userId={user?.id || ''}
        onSubmit={() => router.reload()}
    />
}