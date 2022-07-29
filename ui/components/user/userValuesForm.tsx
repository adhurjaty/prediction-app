import DelphaiInterface from "@/contracts/delphaiInterface";
import { Button, Stack, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import { TextInput } from "../formFields";

interface Props {
    initialState?: { displayName: string, delphai?: DelphaiInterface };
    onSubmit: (values: { displayName: string, flowAddress: string }) => Promise<boolean>;
    submitError?: string;
    titleText: string;
    buttonText: string;
}

export default function UserValuesForm({
    initialState,
    onSubmit,
    submitError,
    buttonText,
    titleText
}: Props) {
    const [address, setAddress] = useState<string>();

    const connectAccount = async (delphai?: DelphaiInterface) => {
        delphai = delphai ?? new DelphaiInterface();
        const flowUser = await delphai.getCurrentUser();
        setAddress(flowUser.addr);
    };

    useEffect(() => {
        if (!(initialState?.delphai)) return;

        connectAccount(initialState.delphai);
    }, [initialState]);

    return (
        <Formik
            initialValues={{
                displayName: initialState?.displayName ?? ""
            }}
            validationSchema={Yup.object({
                displayName: Yup.string().required("Required")
            })}
            onSubmit={async (values, { setSubmitting }) => {
                if (!address) return false;
                const result = await onSubmit({ 
                    displayName: values.displayName,
                    flowAddress: address
                 });
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
                    
                    {
                        address && 
                        <TextInput
                            label="Flow Address"
                            name="flowAddress"
                            type="text"
                            placeholder="Flow Address"
                            value={address}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                        ||
                        <Button
                            variant="contained"
                            onClick={async () => await connectAccount()}
                        >
                            Connect Flow Account
                        </Button>
                    }               
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!address}
                    >
                        {buttonText}
                    </Button>
                    {submitError && <div className="error">{submitError}</div>}
                </Stack>
            </Form>
        </Formik>
    )
}