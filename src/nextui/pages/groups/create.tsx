import { TextInput } from "@/components/formFields";
import LoadingSection from "@/components/loadingSection";
import SecondaryPage from "@/components/secondaryPage";
import Group from "@/models/group";
import { postModel } from "@/utils/nodeInterface";
import { Button, Container, Stack, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import * as Yup from 'yup';

export default function CreateGroupPage() {
    const [submitError, setSubmitError] = useState<string>();

    const router = useRouter();

    const createGroup = async (name: string) => {
        return (await postModel<Group>("/api/groups", { name }))
            .map(group => router.push(`/groups/${group.id}`))
            .mapErr(err => setSubmitError(err))
            .isOk();
    }

    return (
        <SecondaryPage title="Create new group">
            <LoadingSection loading={false}>
                <Container>
                    <Formik
                        initialValues={{ groupName: "" }}
                        validationSchema={Yup.object({
                            groupName: Yup.string()
                                .required("Required")
                                .max(50, "Must be 50 characters or fewer")
                        })}
                        onSubmit={async (values, { setSubmitting }) => {
                            const result = await createGroup(values.groupName);
                            setSubmitting(false);
                            return result;
                        }}
                    >
                        <Form>
                            <Stack spacing={1} marginTop={1}>
                                <TextInput
                                    label="Group Name"
                                    name="groupName"
                                    type="text"
                                    placeholder="Group Name"
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                >
                                    Create
                                </Button>
                                {submitError &&
                                    <Typography
                                        variant="subtitle1"
                                        color="error"
                                    >
                                        {submitError}
                                    </Typography>
                                }
                            </Stack>
                        </Form>
                    </Formik>
                </Container>
            </LoadingSection>
        </SecondaryPage>
    )
}