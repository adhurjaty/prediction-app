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
    const [delphai, setDelphai] = useState<DelphaiInterface>();
    const [flowBalance, setFlowBalance] = useState<number>();
    const [fusdBalance, setFusdBalance] = useState<number>();
    const [fetchError, setFetchError] = useState<string>();

    const connectAccount = async (_delphai?: DelphaiInterface) => {
        if (!_delphai) {
            _delphai = new DelphaiInterface();
            setDelphai(_delphai);
        }
        await _delphai.getCurrentUser()
            .map(flowUser => setAddress(flowUser.addr));
    };

    const getFlowBalance = async () => {
        if (!delphai) return;
        await delphai.getFlowBalance()
            .map(balance => setFlowBalance(balance))
            .mapErr(err => console.error(err));
    }

    const getFusdBalance = async () => {
        if (!delphai) return;
        await delphai.getFUSDBalance()
            .map(balance => setFusdBalance(balance))
            .mapErr(err => setFetchError(err));
    }

    const sufficientFlowBalance = () => {
        return flowBalance && flowBalance >= 0.01;
    }

    const sufficentFusdBalanace = () => {
        return fusdBalance && fusdBalance >= 0;
    }

    useEffect(() => {
        if (!(initialState?.delphai)) return;

        connectAccount(initialState.delphai);
        setDelphai(initialState.delphai);
    }, [initialState]);

    useEffect(() => {
        if (!delphai) return;

        const abortController = new AbortController();

        (async () => {
            if (abortController.signal.aborted) return;
            await Promise.all([getFlowBalance(), getFusdBalance()]); 
        })();

        return () => abortController.abort();
    }, [delphai]);

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
                    {
                        address && flowBalance &&
                        <Typography variant="body1">
                            Flow Balance: {flowBalance}
                        </Typography>
                    }
                    {
                        address && !sufficientFlowBalance() &&
                        <Typography variant="body1">
                            You need at least 0.01 FLOW to create an account
                        </Typography>
                    }
                    {
                        address && fusdBalance &&
                        <Typography variant="body1">
                            FUSD Balance: {fusdBalance}
                        </Typography>
                    }
                    {
                        address && !sufficentFusdBalanace() &&
                        <Typography variant="body1">
                            You need some FUSD to create an account
                        </Typography>
                    }
                    {
                        fetchError &&
                        <div className="error">{fetchError}</div>
                    }
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!address || !sufficientFlowBalance() || !sufficentFusdBalanace()}
                    >
                        {buttonText}
                    </Button>
                    {submitError && <div className="error">{submitError}</div>}
                </Stack>
            </Form>
        </Formik>
    )
}