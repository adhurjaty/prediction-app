import DelphaiInterface from "@/contracts/delphaiInterface";
import Resolution from "@/models/resolution";
import { Button, MenuItem, Stack, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import { SelectInput, TextInput } from "./formFields";

interface Props {
    delphai: DelphaiInterface;
    betId: string;
    userId: string;
}

export default function PlaceResolutionForm({ delphai, betId, userId }: Props) {
    const [submitError, setSubmitError] = useState<string>();
    
    const onSubmit = async (resolution: Resolution) => {
        return (await delphai.voteToResolve(resolution))
            .mapErr(err => setSubmitError(err))
            .isOk();
    }

    return (
        <Formik
            initialValues={{
                resolution: "true",
            }}
            onSubmit={async (values, { setSubmitting }) => {
                var result = await onSubmit({
                    vote: values.resolution === "true",
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