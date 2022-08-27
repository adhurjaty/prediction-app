import DelphaiInterface from "@/contracts/delphaiInterface";
import Resolution from "@/models/resolution";
import { Button, MenuItem, Stack, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { ResultAsync } from "neverthrow";
import { Dispatch, SetStateAction, useState } from "react";
import { SelectInput, TextInput } from "../formFields";

interface Props {
    onSubmit: (resolution: boolean | null) => ResultAsync<any, string>;
}

export default function PlaceResolutionForm({ onSubmit }: Props) {
    const [submitError, setSubmitError] = useState<string>();
    
    const onFormSubmit = async (resolution: boolean | null) => {
        return (await onSubmit(resolution)
            .mapErr(err => setSubmitError(err)))
            .isOk();
    }

    const stringToBool = (s: string) => {
        if (!s) return null;
        if (s === "true") return true;
        return false;
    }

    return (
        <Formik
            initialValues={{
                resolution: "true",
            }}
            onSubmit={async (values, { setSubmitting }) => {
                var result = await onFormSubmit(stringToBool(values.resolution));
                setSubmitting(false);
                return result;
            }}
        >
            {(formik) =>
                <Form>
                    <Stack spacing={1}>
                        <Typography variant="h5">
                            Vote to Resolve
                        </Typography>
                        <SelectInput label="Resolution vote"
                            name="resolution"
                        >
                            <MenuItem value="true">
                                Yes
                            </MenuItem>
                            <MenuItem value="false">
                                No
                            </MenuItem>
                            <MenuItem value="">
                                Inconclusive
                            </MenuItem>
                        </SelectInput>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={formik.isSubmitting}
                        >
                            Place Resoluion
                        </Button>
                        {submitError && <div className="error">{submitError}</div>}
                    </Stack>
                </Form>}
        </Formik>
    )
}