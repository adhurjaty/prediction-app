import LoadingSection from "@/components/loadingSection";
import SecondaryPage from "@/components/secondaryPage";
import Section from "@/components/section";
import { Bet } from "@/models/bet";
import { Group } from "@/models/group";
import { fetchModel } from "@/utils/nodeInterface";
import { Avatar, Button, Container, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";

const ItemContent = styled.div`
    flex-direction: column
`;

export default function GroupPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [group, setGroup] = useState<Group>();
    const [fetchError, setError] = useState<string>();

    const { groupId } = router.query;

    const navLinks = [
        {
            label: 'Add Bet',
            href: `/bets/create?groupId=${groupId}`,
            icon: (
                <img src="../../assets/addBet.svg" />
            )
        },
        {
            label: 'Add Member',
            href: `/group/${groupId}/add-members`,
            icon: (
                <img src="../../assets/addMember.svg" />
            )
        }
    ]

    useEffect(() => {
        const fetchData = async () => {
            if (!groupId)
                return;
            (await fetchModel<Group>(`/api/groups/${groupId}`))
                .map(val => setGroup(val))
                .mapErr(err => setError(err));
        }
        if (session) {
            fetchData();
        }
    }, [session, groupId]);


    const betMade = (stake: number, status: string) => {
        return stake > 0
            ? `you have bet ${stake} FUSD on ${status}`
            : 'you have not bet';
    };

    return (
        <SecondaryPage title={group?.name || "Group"} navLinks={navLinks}> 
            <LoadingSection loading={loading} error={fetchError}>
                <Container>
                    {(group && (<>
                        <Grid container
                            marginTop={2}
                            alignItems="center"
                            justifyContent="center"
                            columnSpacing={2}
                        >
                            <Grid item
                                xs={4}
                                sx={{
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}>
                                <Avatar>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="72" height="60" viewBox="0 0 24 20"><path d="M10.118 16.064c2.293-.529 4.428-.993 3.394-2.945-3.146-5.942-.834-9.119 2.488-9.119 3.388 0 5.644 3.299 2.488 9.119-1.065 1.964 1.149 2.427 3.394 2.945 1.986.459 2.118 1.43 2.118 3.111l-.003.825h-15.994c0-2.196-.176-3.407 2.115-3.936zm-10.116 3.936h6.001c-.028-6.542 2.995-3.697 2.995-8.901 0-2.009-1.311-3.099-2.998-3.099-2.492 0-4.226 2.383-1.866 6.839.775 1.464-.825 1.812-2.545 2.209-1.49.344-1.589 1.072-1.589 2.333l.002.619z"/></svg>
                                </Avatar>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography component="h2" variant="h4">
                                    { group?.name }
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item
                            xs={12}
                            marginTop={2}
                        >
                            <Typography component="h3" variant="h5">
                                Active Bets
                            </Typography>
                        </Grid>
                        <Grid item
                            xs={12}
                        >
                            {(group?.bets && group!.bets.length && <List>
                                {(group!.bets.map(bet => (
                                    <ListItem key={bet.id}
                                        alignItems="flex-start"
                                        sx={{ width: "100%" }}
                                    >
                                        <ListItemButton component="a"
                                            href={`/groups/${groupId}/bets/${bet.id}`}
                                        >
                                            <ListItemIcon>
                                                <Avatar>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M17 12c-3.313 0-6 2.687-6 6s2.687 6 6 6 6-2.687 6-6-2.687-6-6-6zm.5 8.474v.526h-.5v-.499c-.518-.009-1.053-.132-1.5-.363l.228-.822c.478.186 1.114.383 1.612.27.574-.13.692-.721.057-1.005-.465-.217-1.889-.402-1.889-1.622 0-.681.52-1.292 1.492-1.425v-.534h.5v.509c.362.01.768.073 1.221.21l-.181.824c-.384-.135-.808-.257-1.222-.232-.744.043-.81.688-.29.958.856.402 1.972.7 1.972 1.773.001.858-.672 1.315-1.5 1.432zm1.624-10.179c1.132-.223 2.162-.626 2.876-1.197v.652c0 .499-.386.955-1.007 1.328-.581-.337-1.208-.6-1.869-.783zm-2.124-5.795c2.673 0 5-1.007 5-2.25s-2.327-2.25-5-2.25c-2.672 0-5 1.007-5 2.25s2.328 2.25 5 2.25zm.093-2.009c-.299-.09-1.214-.166-1.214-.675 0-.284.334-.537.958-.593v-.223h.321v.211c.234.005.494.03.784.09l-.116.342c-.221-.051-.467-.099-.708-.099l-.072.001c-.482.02-.521.287-.188.399.547.169 1.267.292 1.267.74 0 .357-.434.548-.967.596v.22h-.321v-.208c-.328-.003-.676-.056-.962-.152l.147-.343c.244.063.552.126.828.126l.208-.014c.369-.053.443-.3.035-.418zm-11.093 13.009c1.445 0 2.775-.301 3.705-.768.311-.69.714-1.329 1.198-1.899-.451-1.043-2.539-1.833-4.903-1.833-2.672 0-5 1.007-5 2.25s2.328 2.25 5 2.25zm.093-2.009c-.299-.09-1.214-.166-1.214-.675 0-.284.335-.537.958-.593v-.223h.321v.211c.234.005.494.03.784.09l-.117.342c-.22-.051-.466-.099-.707-.099l-.072.001c-.482.02-.52.287-.188.399.547.169 1.267.292 1.267.74 0 .357-.434.548-.967.596v.22h-.321v-.208c-.329-.003-.676-.056-.962-.152l.147-.343c.244.063.552.126.828.126l.208-.014c.368-.053.443-.3.035-.418zm4.003 8.531c-.919.59-2.44.978-4.096.978-2.672 0-5-1.007-5-2.25v-.652c1.146.918 3.109 1.402 5 1.402 1.236 0 2.499-.211 3.549-.611.153.394.336.773.547 1.133zm-9.096-3.772v-.651c1.146.917 3.109 1.401 5 1.401 1.039 0 2.094-.151 3.028-.435.033.469.107.926.218 1.37-.888.347-2.024.565-3.246.565-2.672 0-5-1.007-5-2.25zm0-2.5v-.652c1.146.918 3.109 1.402 5 1.402 1.127 0 2.275-.176 3.266-.509-.128.493-.21 1.002-.241 1.526-.854.298-1.903.483-3.025.483-2.672 0-5-1.007-5-2.25zm11-11v-.652c1.146.918 3.109 1.402 5 1.402 1.892 0 3.854-.484 5-1.402v.652c0 1.243-2.327 2.25-5 2.25-2.672 0-5-1.007-5-2.25zm0 5v-.652c.713.571 1.744.974 2.876 1.197-.661.183-1.287.446-1.868.783-.622-.373-1.008-.829-1.008-1.328zm0-2.5v-.651c1.146.917 3.109 1.401 5 1.401 1.892 0 3.854-.484 5-1.401v.651c0 1.243-2.327 2.25-5 2.25-2.672 0-5-1.007-5-2.25z" /></svg>
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText primary={bet.title}
                                                secondary="Status"
                                            />
                                            {/* {betMade(bet.stake, bet.status)} */}
                                        </ListItemButton>
                                    </ListItem>
                                )))}
                            </List>)
                            ||
                            <Typography component="p" variant="body2">
                                No bets have been added
                            </Typography>}
                        </Grid>
                        <Grid item
                            xs={12}
                        >
                            <Link href={`/bets/create?groupId=${group!.id}`} passHref>
                                <Button variant="contained">+ bet</Button>
                            </Link>
                        </Grid>
                        <Grid item
                            xs={12}
                            marginTop={2}
                        >
                            <Typography component="h3" variant="h5">
                                Leaderboard
                            </Typography>
                        </Grid>
                        <Grid item
                            xs={12}
                            marginTop={2}
                        >
                            {(group?.users && group!.users.length && (
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 200 }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>User</TableCell>
                                                <TableCell>Accuracy</TableCell>
                                                <TableCell>+/- Prestige</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {group!.users.map(member => (
                                                <TableRow key={member.id}>
                                                    <TableCell>{ member.displayName }</TableCell>
                                                    <TableCell>{ member.accuracy }</TableCell>
                                                    <TableCell>{ member.prestige }</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>))
                                ||
                                (<p>You are the only one here. Add some members to get started.</p>)}
                        </Grid>
                    
                    <Link href={`/group/${group!.id}/add-members`} passHref>
                        <Button variant="contained">+ members</Button>
                    </Link>
                    </>)) || (<></>)}
                </Container>
            </LoadingSection>
        </SecondaryPage>
    );
}