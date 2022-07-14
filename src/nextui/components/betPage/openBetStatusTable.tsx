import User from "@/models/user";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

interface UserState extends User {
    prediction?: boolean,
    wager: number
}

interface Props {
    userStates: UserState[]
}

export default function OpenBetStatusTable({ userStates }: Props) {
    const displayPrediction = (prediction: boolean | undefined) => {
        if (prediction === undefined) {
            return "";
        }
        return prediction ? "Yes" : "No";
    }
    
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Bet</TableCell>
                        <TableCell>Wager</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userStates && userStates.map(member => {
                        return (
                            <TableRow key={member.id}>
                                <TableCell>{member.displayName}</TableCell>
                                <TableCell>{displayPrediction(member.prediction)}</TableCell>
                                <TableCell>{member.wager}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}