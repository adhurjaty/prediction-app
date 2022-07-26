import { Button, Stack, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import { TextInput } from "../formFields";

interface Props {
    initialValues?: { displayName: string, flowAddress: string };
    onSubmit: (values: { displayName: string, flowAddress: string }) => Promise<boolean>;
    submitError?: string;
    titleText: string;
    buttonText: string;
}

export default function UserValuesForm({
    initialValues,
    onSubmit,
    submitError,
    buttonText,
    titleText
}: Props) {
    return (
        <Formik
            initialValues={initialValues ?? {
                displayName: "",
                flowAddress: ""
            }}
            validationSchema={Yup.object({
                displayName: Yup.string().required("Required"),
                flowAddress: Yup.string()
                    .required("Required")
                    .matches(/(?:0x)?[0-9a-hA-H]{16}/, "Must be a valid Flow address")
            })}
            onSubmit={async (values, { setSubmitting }) => {
                const result = await onSubmit({ ...values });
                setSubmitting(false);
                return result;
            }}
        >
            <Form>
                <Stack spacing={1} marginTop={2}>
                    <Typography variant="h5">
                        {titleText}
                    </Typography>
                    <TextInput label="Display Name"
                        name="displayName"
                        type="text"
                        placeholder="Display Name"
                    />
                    <TextInput label="Flow Address"
                        name="flowAddress"
                        type="text"
                        placeholder="Flow Address"
                    />
                    <Button type="submit"
                        variant="contained"
                    >
                        {buttonText}
                    </Button>
                    {submitError && <div className="error">{submitError}</div>}
                </Stack>
            </Form>
        </Formik>
    )
}