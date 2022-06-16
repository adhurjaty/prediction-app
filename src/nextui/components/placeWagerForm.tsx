import DelphaiInterface from "@/contracts/delphaiInterface";
import Wager from "@/models/wager";
import { Button, MenuItem, Stack, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import { SelectInput, TextInput } from "./formFields";

interface Props {
    delphai: DelphaiInterface;
    betId: string;
    userId: string;
}

export default function PlaceWagerForm({ delphai, betId, userId }: Props) {
    const [submitError, setSubmitError] = useState<string>();
    
    const onSubmit = async (wager: Wager) => {
        return (await delphai.placeBet(wager))
            .mapErr(err => setSubmitError(err))
            .isOk();
    }

    return (
        <Formik
            initialValues={{
                prediction: "true",
                wager: 0
            }}
            onSubmit={async (values, { setSubmitting }) => {
                var result = await onSubmit({
                    ...values,
                    prediction: values.prediction === "true",
                    betId,
                    userId
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
                    <SelectInput label="Prediction"
                        name="prediction"
                    >
                        <MenuItem value="true">
                            Yes
                        </MenuItem>
                        <MenuItem value="false">
                            No
                        </MenuItem>
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
                    {submitError && <div className="error">{submitError}</div>}
                </Stack>
            </Form>
        </Formik>
    )
}