import BetState from "@/models/betState";
import User from "@/models/user";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

interface Props {
    users: User[]
    betState: BetState
}

export default function BetStateTable({ users, betState }: Props) {
    const displayPrediction = (prediction: boolean | undefined) => {
        if (prediction === undefined) {
            return "";
        }
        return prediction ? "Yes" : "No";
    }

    const userStates = users.map(user => {
        const userWager = betState.wagers.get(user.mainnetAddress);
        return {
            ...user,
            ...userWager
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userStates && userStates.map(member => {
                        return (
                            <TableRow key={member.id}>
                                <TableCell>{member.displayName}</TableCell>
                                <TableCell>{displayPrediction(member.bet)}</TableCell>
                                <TableCell>{member.amount}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}