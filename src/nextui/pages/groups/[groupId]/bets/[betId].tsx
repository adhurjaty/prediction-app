import LoadingSection from "@/components/loadingSection";
import PlaceResolutionForm from "@/components/placeResolutionForm";
import PlaceWagerForm from "@/components/placeWagerForm";
import SecondaryPage from "@/components/secondaryPage";
import DelphaiInterface from "@/contracts/delphaiInterface";
import Bet from "@/models/bet";
import BetState from "@/models/betState";
import Group from "@/models/group";
import User from "@/models/user";
import { fetchModel } from "@/utils/nodeInterface";
import { Avatar, Container, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
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
    const [betState, setBetState] = useState<BetState>();
    const [user, setUser] = useState<User>();
    const [fetchError, setError] = useState<string>();
    const [delphai, setDelphai] = useState<DelphaiInterface>();

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
        setDelphai(new DelphaiInterface());
    }, [])

    useEffect(() => {
        const abortController = new AbortController();
        
        session && (async () => {
            (await fetchModel<Group>(`/api/groups/${groupId}`, abortController.signal))
                .andThen(val => {
                    setGroup(val);
                    const groupBet = val.bets.find(x => x.id === betId);
                    if (groupBet) {
                        groupBet.closeTime = new Date(groupBet.closeTime);
                        setBet(groupBet);
                        return Ok(groupBet);
                    }
                    return Err(`Could not find bet ${betId} in group ${groupId}`);
                })
                .mapErr(err => setError(err));
                
            !abortController.signal.aborted && delphai
                && (await delphai.getBetState(betId as string))
                .map(state => state && setBetState(state));
            
            (await fetchModel<User>('/api/fullUser', abortController.signal))
                .map(u => setUser(u));
        })().catch(err => {
            if (err.name !== 'AbortError') return;
            throw err;
        })

        return () => abortController.abort();
    }, [session, groupId, betId, delphai]);

    const wagerSection = () => {
        const isBetClosed = !!bet && bet.closeTime.getTime() < Date.now();
        const hasMadeWager = !!betState?.wagers.find(w =>
            w.userAddress === user?.mainnetAddress
            || w.userAddress === `0x${user?.mainnetAddress}`);
        
        if (isBetClosed) {
            return (
                <Typography variant="h6">
                    Bet is closed
                </Typography>
            );
        }
        if (hasMadeWager) {
            return (
                <Typography variant="h6">
                    You have already made a wager for this bet
                </Typography>
            );
        }
        return <PlaceWagerForm
            delphai={delphai}
            betId={bet?.id || ''}
            userAddress={user?.mainnetAddress || ''}
        />;
    }

    const resolutionSection = () => {
        const isBetClosed = !!bet && bet.closeTime.getTime() < Date.now();
        if (!isBetClosed) {
            return (
                <Typography variant="h6">
                    Bet is not closed yet
                </Typography>
            );
        }
        
        return <PlaceResolutionForm
            delphai={delphai}
            betId={bet?.id || ''}
            userId={user?.id || ''}
        />
    }

    return (
        <SecondaryPage title={bet?.title ?? "Bet"} navLinks={navLinks}>
            <LoadingSection loading={loading} error={fetchError}>
                <Container>
                    {(bet &&
                        <Stack spacing={1}
                            marginTop={2}
                            alignItems="center"
                        >
                            <Stack direction="row" spacing={2}>
                                <Avatar>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20"><path d="M10.118 16.064c2.293-.529 4.428-.993 3.394-2.945-3.146-5.942-.834-9.119 2.488-9.119 3.388 0 5.644 3.299 2.488 9.119-1.065 1.964 1.149 2.427 3.394 2.945 1.986.459 2.118 1.43 2.118 3.111l-.003.825h-15.994c0-2.196-.176-3.407 2.115-3.936zm-10.116 3.936h6.001c-.028-6.542 2.995-3.697 2.995-8.901 0-2.009-1.311-3.099-2.998-3.099-2.492 0-4.226 2.383-1.866 6.839.775 1.464-.825 1.812-2.545 2.209-1.49.344-1.589 1.072-1.589 2.333l.002.619z"/></svg>
                                </Avatar>
                                <Typography component="h2" variant="h5">
                                    Group: { group?.name ?? ""}
                                </Typography>
                            </Stack>
                            <Typography component="h4" variant="h5">
                                {bet?.title ?? ""}
                            </Typography>
                            <Typography component="p" variant="subtitle1">
                                {bet.description}
                            </Typography>
                            <Typography variant="h6">
                                Members
                            </Typography>
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
                            {wagerSection()}
                            {resolutionSection()}
                    </Stack>)}
                </Container>
            </LoadingSection>
        </SecondaryPage>
    );
}