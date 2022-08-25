import BetState from "@/models/betState";
import ResolverState from "@/models/resolverState";
import User from "@/models/user";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

interface Props {
    users: User[]
    resolverState: ResolverState
    betState: BetState
}

export default function ResolverStateTable({ users, resolverState, betState }: Props) {
    const displayVote = (vote: boolean | undefined) => {
        if (vote === undefined) {
            return "Inconclusive";
        }
        return vote ? "Yes" : "No";
    }

    const displayPrediction = (prediction: boolean | undefined) => {
        if (prediction === undefined) {
            return "";
        }
        return prediction ? "Yes" : "No";
    }

    const userStates = users.map(user => {
        const userWager = betState.wagers[user.mainnetAddress];
        const userVote = resolverState.votes[user.mainnetAddress];
        return {
            hasVoted: user.mainnetAddress in resolverState.votes,
            ...user,
            ...userWager,
            ...userVote,
        }
    })
    
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Prediction</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Vote</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userStates && userStates.map(member => {
                        return (
                            <TableRow key={member.id}>
                                <TableCell>{member.displayName}</TableCell>
                                <TableCell>{displayPrediction(member.bet)}</TableCell>
                                <TableCell>{member.amount}</TableCell>
                                <TableCell>{member.hasVoted
                                    ? displayVote(member.vote)
                                    : ""}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}