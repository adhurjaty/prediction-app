import { useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";

interface FieldProps {
    id?: string,
    label: string,
    name: string
}

interface TextFieldProps extends FieldProps {
    type?: string,
    placeholder?: string
}

const TextInput = ({ label, ...props }: TextFieldProps) => {
    const [field, meta] = useField(props);
    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <input className="text-input" {...field} {...props} />
            {meta.touched && meta.error
                ? (<div className="error">{meta.error}</div>)
                : null}
        </>
    );
};

interface SelectFieldProps extends FieldProps {
    children?: JSX.Element[]
}

const TextAreaInput = ({ label, ...props }: TextFieldProps) => {
    const [field, meta] = useField(props);
    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <textarea className="text-input" {...field} {...props} />
            {meta.touched && meta.error
                ? (<div className="error">{meta.error}</div>)
                : null}
        </>
    );
};

interface DateFieldProps extends FieldProps {
    minTime?: Date,
    maxTime?: Date,
    dateFormat?: string
}

const SelectInput = ({ label, ...props }: SelectFieldProps) => {
    const [field, meta] = useField(props);
    return (
        <div>
            <label htmlFor={props.id || props.name}>{label}</label>
            <select {...field} {...props} />
            {meta.touched && meta.error
                ? (<div className="error">{meta.error}</div>)
                : null}
        </div>
    );
};

const DatePickerInput = ({ ...props }: DateFieldProps) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(props);
    return (
        <div>
            <DatePicker
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={val => {
                    setFieldValue(field.name, val);
                }}
            />
            {meta.touched && meta.error
                ? (<div className="error">{meta.error}</div>)
                : null}
        </div>
    );
};

export {
    TextInput,
    TextAreaInput,
    SelectInput,
    DatePickerInput
}