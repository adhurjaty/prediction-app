import ComposerState from "@/models/composerState";
import User from "@/models/user";
import { Button, Typography } from "@mui/material";
import { ResultAsync } from "neverthrow";
import { useState } from "react";
import ErrorText from "../errorText";
import ResolvedBetStatusTable from "./resolvedBetStatusTable";

interface Props {
    users: User[],
    userAddress: string,
    composerState: ComposerState,
    onSubmit: () => ResultAsync<any, string>
}

export default function ResolvedBetSection({ users, userAddress, composerState, onSubmit }: Props) {
    const [submitError, setSubmitError] = useState<string>();

    const { resolverState, payoutState } = composerState;
    const { result } = resolverState;
    const { hasRetrieved } = payoutState.payouts.get(userAddress)!;

    const displayResult = () => {
        if (result === undefined) return "Inconclusive";
        return result ? "Yes" : "No";
    }
    
    const claimWinnings = async () => {
        // return (await delphai.retrieveWinning(betId))
        return (await onSubmit()
            .mapErr(err => setSubmitError(err)))
            .isOk();
    };

    return (
        <>
            <Typography variant="h6">
                Bet is resolved: {displayResult()}
            </Typography>
            <ResolvedBetStatusTable users={users} composerState={composerState} />
            {!hasRetrieved && <Button
                variant="contained"
                color="primary"
                onClick={claimWinnings}
            >
                Claim Winnings
            </Button>}
            {submitError && <ErrorText text={submitError} />}
        </>
    )
}