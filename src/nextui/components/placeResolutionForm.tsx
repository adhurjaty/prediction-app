import { Button, MenuItem, Stack, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { Dispatch, SetStateAction } from "react";
import { SelectInput, TextInput } from "./formFields";

interface Props {
    onSubmit: (values: any) => Promise<boolean>;
    submitError: string;
}

export default function PlaceResolutionForm({ onSubmit, submitError }: Props) {
    
    return (
        <Formik
            initialValues={{
                resolution: "true",
                wager: 0
            }}
            onSubmit={async (values, { setSubmitting }) => {
                var result = await onSubmit(values);
                setSubmitting(false);
                return result;
            }}
        >
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
                    </SelectInput>
                    <Button
                        type="submit"
                        variant="contained"
                    >
                        Place Resoluion
                    </Button>
                    {submitError && <div className="error">{submitError}</div>}
                </Stack>
            </Form>
        </Formik>
    )
}