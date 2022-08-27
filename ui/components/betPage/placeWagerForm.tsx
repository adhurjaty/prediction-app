import DelphaiInterface from "@/contracts/delphaiInterface";
import BetState from "@/models/betState";
import Wager from "@/models/wager";
import BetsInterface from "@/utils/betsInterface";
import { Button, MenuItem, Stack, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { ResultAsync } from "neverthrow";
import { useState } from "react";
import ErrorText from "../errorText";
import { SelectInput, TextInput } from "../formFields";

interface Props {
    onSubmit: (formInput: { wager: number, prediction: boolean }) => ResultAsync<any, string>;
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

export default function PlaceWagerForm({ onSubmit }: Props) {
    const [submitError, setSubmitError] = useState<string>();

    const onFormSubmit = async (wager: { wager: number, prediction: boolean }) => {
        return (await onSubmit(wager)
            .mapErr(err => setSubmitError(err)))
            .isOk();
    }

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                prediction: "true",
                wager: 0
            }}
            validate={(values) => {
                if (!values.wager.toFixed) {
                    return {
                        wager: "Wager must be a number"
                    }
                }
            }}
            onSubmit={async (values, { setSubmitting }) => {
                var result = await onFormSubmit({
                    ...values,
                    prediction: values.prediction === "true",
                });
                setSubmitting(false);
                return result;
            }}
        >
            {(formik) =>
                <Form>
                    <Stack spacing={1}>
                        <Typography variant="h5">
                            Place Wager
                        </Typography>
                        <SelectInput label="Prediction"
                            name="prediction"
                        >
                            {initPredictionOptions
                                .map((x, i) => (
                                    <MenuItem value={x.value.toString()} key={i}>
                                        {x.label}
                                    </MenuItem>
                                ))
                            }
                        </SelectInput>
                        <TextInput label="Wager"
                            name="wager"
                            type="number"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={formik.isSubmitting}
                        >
                            Place Wager
                        </Button>
                        {submitError &&
                            <ErrorText text={submitError} />
                        }
                    </Stack>
                </Form>}
        </Formik>
    )
}