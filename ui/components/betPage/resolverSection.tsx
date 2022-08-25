import ComposerState from "@/models/composerState";
import User from "@/models/user";
import { Typography } from "@mui/material";
import { ResultAsync } from "neverthrow";
import PlaceResolutionForm from "./placeResolutionForm";
import ResolverStateTable from "./resolverStateTable";

interface Props {
    users: User[]
    userAddress: string
    composerState: ComposerState
    onSubmit: (vote: boolean | null) => ResultAsync<any, string>
}

export default function ResolverSection({ users, userAddress, composerState, onSubmit }: Props) {
    // const isBetClosed = !!bet && bet.closeTime.getTime() < Date.now();
    // if (!isBetClosed) {
    //     return (
    //         <Typography variant="h6">
    //             Bet is not closed yet
    //         </Typography>
    //     );
    // }

    const { betState, resolverState } = composerState;

    const userVote = resolverState.votes[userAddress];

    return (
        <>
            <ResolverStateTable
                users={users}
                resolverState={resolverState}
                betState={betState}
            />
            {userVote &&
                <Typography variant="h6">
                    You have already voted to resolve this bet
                </Typography>
            ||
                <PlaceResolutionForm onSubmit={onSubmit} />
            }
        </>
    )
}