import LoadingSection from "@/components/loadingSection";
import PrimaryPage from "@/components/primaryPage";
import UserValuesForm from "@/components/user/userValuesForm";
import User from "@/models/user";
import { fetchModel, putModel } from "@/utils/nodeInterface";
import { Container } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface UserFormData {
    displayName: string;
    flowAddress: string;
}

export default function EditUser() {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [user, setUser] = useState<User>();
    const [fetchError, setError] = useState<string>();
    const [submitError, setSubmitError] = useState<string>();

    useEffect(() => {
        const fetchData = async () => {
            (await fetchModel<User>("/api/user"))
                .map(val => setUser(val))
                .mapErr(err => setError(err));
        }
        if (session) {
            fetchData();
        }
    }, [session]);

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
                    {user && <UserValuesForm
                        initialValues={{
                            displayName: user.displayName,
                            flowAddress: user.mainnetAddress ?? ""
                        }}
                        onSubmit={updateUser}
                        submitError={submitError}
                    />}
                </Container>
            </LoadingSection>
        </PrimaryPage>
    )
}