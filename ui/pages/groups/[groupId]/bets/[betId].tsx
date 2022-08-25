import LoadingSection from "@/components/loadingSection";
import PlaceResolutionForm from "@/components/betPage/placeResolutionForm";
import PlaceWagerForm from "@/components/betPage/placeWagerForm";
import SecondaryPage from "@/components/secondaryPage";
import DelphaiInterface from "@/contracts/delphaiInterface";
import Bet from "@/models/bet";
import ComposerState from "@/models/composerState";
import Group from "@/models/group";
import User from "@/models/user";
import { fetchModel } from "@/utils/nodeInterface";
import { Avatar, Container, Stack, Typography, useRadioGroup } from "@mui/material";
import { err, Err, errAsync, ok, Ok } from "neverthrow";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ResolvedBetStatusTable from "@/components/betPage/resolvedBetStatusTable";
import ResolvedBetSection from "@/components/betPage/resolvedBetSection";
import WagerSection from "@/components/betPage/wagerSection";
import Wager from "@/models/wager";
import BetsInterface from "@/utils/betsInterface";
import ResolverSection from "@/components/betPage/resolverSection";


export default function BetPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [bet, setBet] = useState<Bet>();
    const [group, setGroup] = useState<Group>();
    const [composerState, setComposerState] = useState<ComposerState>();
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
        if (!groupId || !betId || !session) return;

        const abortController = new AbortController();
        
        (async () => {
            await fetchModel<Group>(`/api/groups/${groupId}`, abortController.signal)
                .andThen(val => {
                    setGroup(val);
                    const groupBet = val.bets.find(x => x.id === betId);
                    if (groupBet) {
                        setBet(groupBet);
                        return ok(groupBet);
                    }
                    return err(`Could not find bet ${betId} in group ${groupId}`);
                })
                .mapErr(err => setError(err));
        })().catch(err => {
            if (err.name !== 'AbortError') return;
            throw err;
        })

        return () => abortController.abort();
    }, [session, groupId, betId]);

    useEffect(() => {
        if (!session) return;

        const abortController = new AbortController();

        (async () => {
            await fetchModel<User>('/api/fullUser', abortController.signal)
                .map(u => setUser(u));
        })().catch(err => {
            if (err.name !== 'AbortError') return;
            throw err;
        })
        return () => abortController.abort();
    }, [session]);

    useEffect(() => {
        if (!betId || !delphai) return;

        const abortController = new AbortController();

        (async () => {
            !abortController.signal.aborted && delphai
                && await delphai.getComposerState(betId as string)
                .map(state => {
                    debugger;
                    return state;
                })
                .map(state => state && setComposerState(state));
        })().catch(err => {
            if (err.name !== 'AbortError') return;
            throw err;
        })
        return () => abortController.abort();
    }, [betId, delphai])

    const onSubmitWager = (wager: { wager: number, prediction: boolean }) => {
        if (!delphai || !bet || !user) {
            return errAsync("Bet page not initialized properly");
        }

        const betInterface = new BetsInterface(delphai);
        return betInterface.placeBet({
            ...wager,
            betId: bet.id,
            userAddress: user.mainnetAddress
        }).map(() => router.reload());
    }

    const onSubmitVote = (vote: boolean | null) => {
        if (!delphai || !bet?.id || !user?.id) {
            return errAsync("Bet page not initialized properly");
        }

        return delphai.voteToResolve({
            vote,
            betId: bet.id,
            userId: user?.id
        }).map(() => router.reload());
    }

    const onSubmitRetrieve = () => {
        if (!delphai || !betId) 
            return errAsync("Bet page not initialized properly");
        return delphai.retrieveWinning(betId as string);
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
                            {group?.users
                            && user?.mainnetAddress
                            && composerState?.betState
                            && (composerState?.betState.isResolved
                                &&
                                <ResolvedBetSection
                                    users={group.users}
                                    userAddress={user.mainnetAddress}
                                    composerState={composerState}
                                    onSubmit={onSubmitRetrieve}
                                />
                                ||
                                <>
                                <WagerSection
                                    users={group.users}
                                    userAddress={user.mainnetAddress}
                                    betState={composerState.betState}
                                    onSubmit={onSubmitWager}
                                />
                                <ResolverSection
                                    users={group.users}
                                    userAddress={user.mainnetAddress}
                                    composerState={composerState}
                                    onSubmit={onSubmitVote}
                                />
                                </>)
                            }
                    </Stack>)}
                </Container>
            </LoadingSection>
        </SecondaryPage>
    );
}