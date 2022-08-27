import ComposerState from "@/models/composerState";
import User from "@/models/user";
import { displayMoney } from "@/utils/displayHelpers";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

interface Props {
    users: User[],
    composerState: ComposerState
}

export default function ResolvedBetStatusTable({ users, composerState }: Props) {
    const { betState, resolverState, payoutState } = composerState;
    const result = resolverState.result;
    const userStates = users.map(user => {
        const payout = payoutState.payouts[user.mainnetAddress];
        const bet = betState.wagers[user.mainnetAddress];
        return {
            ...user,
            ...payout,
            bet: bet.bet
        }
    })

    const displayStatus = (prediction: boolean | null) => {
        if (result == undefined || result == null)
            return "Inconclusive"
        return prediction === result ? "Winner" : "Loser";
    }

    const diplayRetrieved = (status: boolean) => {
        return status ? "Retrieved" : "Pending";
    }
    
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Return</TableCell>
                        <TableCell>Has Retrieved</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userStates && userStates.map(member => (
                        <TableRow key={member.id}>
                            <TableCell>{member.displayName}</TableCell>
                            <TableCell>{displayStatus(member.bet!)}</TableCell>
                            <TableCell>{displayMoney(member.amount!)}</TableCell>
                            <TableCell>{diplayRetrieved(member.hasRetrieved!)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}