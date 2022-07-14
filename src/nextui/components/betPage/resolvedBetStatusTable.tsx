import User from "@/models/user";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

interface UserState extends User {
    prediction?: boolean,
    wager: number
}

interface Props {
    userStates: UserState[]
    result: boolean
}

export default function ResolvedBetStatusTable({ userStates, result }: Props) {

    const displayStatus = (prediction: boolean | undefined) => {
        if (prediction === undefined) {
            return "";
        }
        return prediction === result ? "Winner" : "Loser";
    }
    
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Return</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userStates && userStates.map(member => {
                        return (
                            <TableRow key={member.id}>
                                <TableCell>{member.displayName}</TableCell>
                                <TableCell>{displayStatus(member.prediction)}</TableCell>
                                <TableCell>{member.wager}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}