import LoadingSection from "@/components/loadingSection";
import PrimaryPage from "@/components/primaryPage";
import UserValuesForm from "@/components/user/userValuesForm";
import DelphaiInterface from "@/contracts/delphaiInterface";
import User from "@/models/user";
import { fetchModel, putModel } from "@/utils/nodeInterface";
import { Container, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface UserFormData {
    displayName: string;
    flowAddress: string;
}

export default function EditUser() {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [delphai, setDelphai] = useState<DelphaiInterface>();
    const [user, setUser] = useState<User>();
    const [fusdBalance, setFusdBalance] = useState<number>();
    const [fetchError, setFetchUserError] = useState<string>();
    const [fetchFusdError, setFetchFusdError] = useState<string>();
    const [submitError, setSubmitError] = useState<string>();

    useEffect(() => {
        setDelphai(new DelphaiInterface());
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            (await fetchModel<User>("/api/user"))
                .map(val => setUser(val))
                .mapErr(err => setFetchUserError(err));
        }
        if (session) {
            fetchData();
        }
    }, [session]);

    useEffect(() => {
        if (!delphai) return;

        const abortController = new AbortController();

        (async () => {
            if (abortController.signal.aborted) return;
            (await delphai.getFUSDBalance())
                .map(balance => setFusdBalance(balance))
                .mapErr(err => setFetchFusdError(err));
        })();

        return () => abortController.abort();
    }, [delphai]);

    const updateUser = async (userValues: UserFormData) => {
        return (await putModel<User>("/api/user", {
                ...user,
                displayName: userValues.displayName,
                mainnetAddress: userValues.flowAddress
            }))
            .mapErr(err => setSubmitError(err))
            .isOk();
    };

    return (
        <PrimaryPage title="Account">
            <LoadingSection loading={loading} error={fetchError}>
                <Container>
                    <Stack
                        direction="column"
                        spacing={1}
                    >
                        {user && <UserValuesForm
                            initialState={{
                                displayName: user.displayName,
                                delphai: delphai
                            }}
                            onSubmit={updateUser}
                            submitError={submitError}
                            titleText="Edit User"
                            buttonText="Save"
                        />}
                        <>
                            <Typography variant="h6">
                                FUSD Balance
                            </Typography>
                            {
                                !fetchFusdError &&
                                (
                                    <Typography variant="body1">
                                        {fusdBalance} FUSD
                                    </Typography>
                                )
                                ||
                                (
                                    <Typography 
                                        variant="subtitle1"
                                        color="error"
                                    >
                                        {fetchFusdError}
                                    </Typography>
                                )
                            }
                        </>
                    </Stack>
                </Container>
            </LoadingSection>
        </PrimaryPage>
    )
}