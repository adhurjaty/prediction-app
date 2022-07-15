import { TextInput } from "@/components/formFields";
import LoadingSection from "@/components/loadingSection";
import SecondaryPage from "@/components/secondaryPage";
import Group from "@/models/group";
import User from "@/models/user";
import { fetchModel, putModel } from "@/utils/nodeInterface";
import { Button, Container, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AddMembers() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [group, setGroup] = useState<Group>();
    const [fetchError, setFetchError] = useState<string>();
    const [submitError, setSubmitError] = useState<string>();

    const { groupId } = router.query;

    useEffect(() => {
        const abortController = new AbortController();

        session && (async () => {
            (await fetchModel<Group>(`/api/groups/${groupId}`, abortController.signal))
                .map(setGroup)
                .mapErr(err => setFetchError(err))
        })();

        return () => abortController.abort();
    }, [session, groupId])

    const addMember = async (address: string) => {
        const abortController = new AbortController();

        const emailParam = encodeURI(address);
        return (await fetchModel<User>(`/api/user?email=${emailParam}`, abortController.signal))
            .map(user => setGroup({
                ...group!,
                users: [user, ...group!.users]
            }))
            .mapErr(err => setSubmitError(err))
            .isOk();
    };

    const updateGroup = async () => {
        return (await putModel<Group>(`/api/groups/${groupId}`, {
            group,
        }))
            .map(_ => router.push(`/groups/${groupId}`))
            .mapErr(err => setSubmitError(err));
    }

    return (
        <SecondaryPage title="Add Members">
            <LoadingSection loading={loading} error={fetchError}>
                <Container>
                    <Typography variant="h5">
                        Add Members
                    </Typography>
                    <Stack spacing={1}>
                        <Formik
                            initialValues={{
                                address: ""
                            }}
                            onSubmit={async (values, { setSubmitting, resetForm }) => {
                                const result = await addMember(values.address);
                                setSubmitting(false);
                                if (result) resetForm({ values: { address: "" } });
                                return result;
                            }}
                        >
                            <Form onChange={(_) => setSubmitError(undefined)}>
                                <Stack direction="row">
                                    <TextInput label="Member Address"
                                        name="address"
                                        type="text"
                                        placeholder="Member Address"
                                    />
                                    <Button
                                        type="submit"
                                    >
                                        Add
                                    </Button>
                                </Stack>
                                {submitError &&
                                    <Typography
                                        variant="subtitle1"
                                        color="error"
                                        sx={{
                                            wordWrap: "break-word"
                                        }}
                                    >
                                        {submitError}
                                    </Typography>
                                }
                            </Form>
                        </Formik>
                        <Typography variant="h6">
                            Members
                        </Typography>
                        <List>
                            {(group?.users || []).map(member => (
                                <ListItem key={member.id}>
                                    <ListItemText
                                        primary={member.displayName}
                                        secondary={member.email}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <Button variant="contained" onClick={updateGroup}>
                            Save
                        </Button>
                    </Stack>
                </Container>
            </LoadingSection>
        </SecondaryPage>
    )
}