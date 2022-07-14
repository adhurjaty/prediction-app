import DelphaiInterface from "@/contracts/delphaiInterface";
import { Button, Typography } from "@mui/material";

interface Props {
    result: boolean;
    delphai: DelphaiInterface;
    betId: string;
    returnAmount: number;
}

export default function ResolvedBetSection({ result, delphai, betId, returnAmount }: Props) {
    const claimWinnings = async () => {
        return (await delphai.retrieveWinning(betId))
            .map(() => true)
            .mapErr(err => console.error(err))
            .isOk();
    };

    return (
        <>
            <Typography variant="h6">
                Bet is resolved: {result ? "Yes" : "No"}
            </Typography>
            {returnAmount > 0 && <Button
                variant="contained"
                color="primary"
                onClick={claimWinnings}
            >
                Claim Winnings
            </Button>}
        </>
    )
}