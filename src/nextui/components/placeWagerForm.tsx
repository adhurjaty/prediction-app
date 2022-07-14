import DelphaiInterface from "@/contracts/delphaiInterface";
import BetState from "@/models/betState";
import Wager from "@/models/wager";
import { Button, MenuItem, Stack, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { SelectInput, TextInput } from "./formFields";

interface Props {
    delphai?: DelphaiInterface;
    betId: string;
    userAddress: string;
    betState?: BetState;
    onSubmit?: () => void;
}

const initPredictionOptions = [
    {
        value: true,
        label: "Yes"
    },
    {
        value: false,
        label: "No"
    }
];

export default function PlaceWagerForm({ delphai, betId, userAddress, betState, onSubmit }: Props) {
    const [submitError, setSubmitError] = useState<string>();

    const getMaxWager = () => {
        if (betState?.hubPrediction !== undefined && betState?.hubPrediction !== null) {
            const hubWager = betState.wagers
                .find(w => w.prediction === betState.hubPrediction);
            return hubWager!.wager - betState.wagers
                .filter(w => w.prediction != betState.hubPrediction)
                .reduce((sum, w) => sum + w.wager, 0);
        }
    };

    const onFormSubmit = async (wager: Wager) => {
        if (!delphai)
            return false;
        
        return (await delphai.placeBet(wager))
            .map(() => onSubmit && onSubmit())
            .mapErr(err => setSubmitError(err))
            .isOk();
    }

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                prediction: (!betState?.hubPrediction ?? true).toString(),
                wager: 0
            }}
            validate={(values) => {
                const maxWager = getMaxWager();
                if (!values.wager.toFixed) {
                    return {
                        wager: "Wager must be a number"
                    }
                }
                if (maxWager && maxWager < values.wager) {
                    return {
                        wager: `Wager must be less than ${maxWager}`
                    };
                }
            }}
            onSubmit={async (values, { setSubmitting }) => {
                var result = await onFormSubmit({
                    ...values,
                    prediction: values.prediction === "true",
                    betId,
                    userAddress
                });
                setSubmitting(false);
                return result;
            }}
        >
            <Form>
                <Stack spacing={1}>
                    <Typography variant="h5">
                        Place Wager
                    </Typography>
                    {betState?.hubPrediction !== undefined &&
                        <>
                        <Typography variant="subtitle1">
                            Hub bet: {betState.hubPrediction ? "Yes" : "No"}
                        </Typography>
                        <Typography variant="subtitle2">
                            Max wager: {getMaxWager()}
                        </Typography>
                        </>
                    }
                    <SelectInput label="Prediction"
                        name="prediction"
                    >
                        {initPredictionOptions
                            .filter(x => x.value !== betState?.hubPrediction)
                            .map((x, i) => (
                            <MenuItem value={x.value.toString()} key={i}>
                                {x.label}
                            </MenuItem>
                        ))}
                    </SelectInput>
                    <TextInput label="Wager"
                        name="wager"
                        type="number"
                    />
                    <Button
                        type="submit"
                        variant="contained"

                    >
                        Place Wager
                    </Button>
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
                </Stack>
            </Form>
        </Formik>
    )
}