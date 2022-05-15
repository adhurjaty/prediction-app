import LoadingSection from "@/components/loadingSection";
import SecondaryPage from "@/components/secondaryPage";
import Section from "@/components/section";
import { CircleInner } from "@/components/styled";
import { Bet } from "@/models/bet";
import { Group } from "@/models/group";
import { fetchModel } from "@/utils/nodeInterface";
import { Avatar, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Err, Ok } from "@sniptt/monads/build";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BetPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [bet, setBet] = useState<Bet>();
    const [group, setGroup] = useState<Group>();
    const [fetchError, setError] = useState<string>();

    const { groupId, betId } = router.query;

    const navLinks = [
        {
            label: 'Create Bet',
            href: `/bets/create`,
            icon: (
                <img src="../../assets/addBet.svg" />
            )
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            (await fetchModel<Group>(`/api/groups/${groupId}`))
                .andThen(val => {
                    setGroup(val);
                    const groupBet = val.bets.find(x => x.id === betId);
                    if (groupBet) {
                        setBet(groupBet);
                        return Ok(groupBet);
                    }
                    return Err(`Could not find bet ${betId} in group ${groupId}`);
                })
                .mapErr(err => setError(err));
        }
        if (session) {
            fetchData();
        }
    }, [session, groupId, betId]);

    return (
        <SecondaryPage title={bet?.title ?? "Bet"} navLinks={navLinks}>
            <LoadingSection loading={loading} error={fetchError}>
                <Container>
                    {(bet &&
                        <Grid container
                            marginTop={2}
                            alignItems="center"
                        >
                            <Grid item xs={12} justifyContent="center">
                                <Typography component="h2" variant="h5">
                                    Group: { group?.name ?? ""}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Avatar>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20"><path d="M10.118 16.064c2.293-.529 4.428-.993 3.394-2.945-3.146-5.942-.834-9.119 2.488-9.119 3.388 0 5.644 3.299 2.488 9.119-1.065 1.964 1.149 2.427 3.394 2.945 1.986.459 2.118 1.43 2.118 3.111l-.003.825h-15.994c0-2.196-.176-3.407 2.115-3.936zm-10.116 3.936h6.001c-.028-6.542 2.995-3.697 2.995-8.901 0-2.009-1.311-3.099-2.998-3.099-2.492 0-4.226 2.383-1.866 6.839.775 1.464-.825 1.812-2.545 2.209-1.49.344-1.589 1.072-1.589 2.333l.002.619z"/></svg>
                                </Avatar>
                            </Grid>
                            <Grid item xs={10}>
                                <Typography component="h4" variant="h5">
                                    {bet?.title ?? ""}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography component="p" variant="subtitle1">
                                    {bet.description}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6">
                                    Members
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {group?.users?.length &&
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>User</TableCell>
                                                    <TableCell>Bet</TableCell>
                                                    <TableCell>Resolution vote</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {group.users.map(member => (
                                                    <TableRow key={member.id}>
                                                        <TableCell>{member.displayName}</TableCell>
                                                        <TableCell>{member.accuracy}</TableCell>
                                                        <TableCell>{member.prestige}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    ||
                                    <Typography variant="body2">
                                        No one is in the group!
                                    </Typography>}
                            </Grid>

                        {/* <form>
                            <div v-if="existingUserWager">
                                You've already made a prediction
                            </div>
                            <div v-else-if="hasBetClosed">
                                Bet is closed
                            </div>
                            <div v-else>
                                <h3>Place Wager</h3>
                                <label>Prediction<span class="required">*</span></label>
                                <select v-model="userWager.prediction">
                                    <option :value="true">Yes</option>
                                    <option :value="false">No</option>
                                </select>
                                <label>Wager<span class="required">*</span></label>
                                <input type="number" 
                                    v-model="userWager.wager"
                                    required />
                                <button @click="placeWager()">Place wager</button>
                            </div>
                            <div v-if="hasResolutionVote">
                                You've already voted to resolve
                            </div>
                            <div v-else-if="!hasBetClosed">
                                Bet is still open
                            </div>
                            <div v-else>
                                <h3>Vote to resolve</h3>
                                <label>Resolution vote<span class="required">*</span></label>
                                <select v-model="userResolution.vote">
                                    <option :value="true">Yes</option>
                                    <option :value="false">No</option>
                                </select>
                                <button @click="placeWager()">Place wager</button>
                            </div>
                        </form > */}
                        </Grid>)}
                </Container>
            </LoadingSection>
        </SecondaryPage>
    );
}