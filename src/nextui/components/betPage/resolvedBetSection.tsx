import DelphaiInterface from "@/contracts/delphaiInterface";
import { Button, Typography } from "@mui/material";

interface Props {
    result: boolean;
    delphai: DelphaiInterface;
    betId: string;
}

export default function ResolvedBetSection({ result, delphai, betId }: Props) {
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
            <Button
                variant="contained"
                color="primary"
                onClick={claimWinnings}
            >
                Claim Winnings
            </Button>
        </>
    )
}