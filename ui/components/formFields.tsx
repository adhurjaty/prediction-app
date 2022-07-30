import { FormControl, FormHelperText, InputLabel, Select, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import { ChangeEvent } from "react";

interface FieldProps {
    id?: string,
    label: string,
    name: string,
    InputProps?: any,
}

interface TextFieldProps extends FieldProps {
    type?: string,
    placeholder?: string,
    value?: string
}

const TextInput = ({ label, ...props }: TextFieldProps) => {
    const [field, meta] = useField(props);
    const isError = (meta.touched && meta.error) as boolean;
    return (
        <TextField
            error={isError}
            id={props.id || props.name}
            label={label}
            {...field}
            {...props}
            helperText={meta.error}
            variant="filled"
        />
    );
};

const TextAreaInput = ({ label, ...props }: TextFieldProps) => {
    const [field, meta] = useField(props);
    const isError = (meta.touched && meta.error) as boolean;
    return (
        <TextField
            error={isError}
            id={props.id || props.name}
            multiline
            label={label}
            {...field}
            {...props}
            helperText={meta.error}
            variant="filled"
        />
    );
};

interface SelectFieldProps extends FieldProps {
    children?: JSX.Element[]
}

const SelectInput = ({ label, children, ...props }: SelectFieldProps) => {
    const [field, meta] = useField(props);
    const isError = (meta.touched && meta.error) as boolean;
    const idName = props.id || props.name
    const labelId = `${idName}-label`
    return (
        <FormControl error={isError}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                id={props.id || props.name}
                labelId={`${(props.id || props.name)}-label`}
                label={label}
                {...field}
                {...props}
            >
                {children}
            </Select>
            <FormHelperText>{(isError && meta.error) || label}</FormHelperText>
        </FormControl>
    );
};

interface DateFieldProps extends FieldProps {
    minTime?: Date,
    maxTime?: Date,
    dateFormat?: string
}

const DatePickerInput = ({ minTime, ...props }: DateFieldProps) => {
    const formik = useFormikContext();
    const [field, meta] = useField(props);
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
                minDateTime={minTime}
                renderInput={params => <TextField {...params} />}
                value={field.value}
                // onBlur={field.onBlur}
                onChange={(date: Date | null) => {
                    formik.setFieldValue(field.name, date);
                }}
                {...props}
            />
            {meta.touched && meta.error
                ? (<div className="error">{meta.error}</div>)
                : null}
        </LocalizationProvider>
    );
};

export {
    TextInput,
    TextAreaInput,
    SelectInput,
    DatePickerInput
}