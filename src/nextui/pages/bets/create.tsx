import LoadingSection from "@/components/loadingSection";
import SecondaryPage from "@/components/secondaryPage";
import Section from "@/components/section";
import { Bet } from "@/models/bet";
import { Group } from "@/models/group";
import { fetchModel, postModel } from "@/utils/nodeInterface";
import { Form, Formik, useField, useFormikContext } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import DatePicker from "react-datepicker";

interface BetFormData {
    groupId?: string;
    title?: string;
    description?: string;
    closeTime: Date;
    amount?: number;
    resolutionDescription?: string;
    wager: number;
}

function defaultDate(): Date {
    var now = new Date();
    var time = now.getTime()
    var twoWeeks = 1000 * 60 * 60 * 24 * 14;
    var seconds = now.getSeconds() * 1000
    return new Date(time - seconds + twoWeeks);
}

interface FieldProps {
    id?: string,
    label: string,
    name: string
}

interface TextFieldProps extends FieldProps {
    type?: string,
    placeholder?: string
}

interface SelectFieldProps extends FieldProps {
    children?: JSX.Element[]
}

interface DateFieldProps extends FieldProps {
    minTime?: Date,
    maxTime?: Date
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

const Select = ({ label, ...props }: SelectFieldProps) => {
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

const DatePickerField = ({ ...props }: DateFieldProps) => {
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

export default function CreateBetPage() {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [groups, setGroups] = useState<Group[]>();
    const [fetchError, setfetchError] = useState<string>();
    const [submitError, setSubmitError] = useState<string>();
    
    const router = useRouter();
    const { groupId } = router.query;

    const emptyGroup = {
        id: '',
        name: ''
    };

    useEffect(() => {
        const fetchData = async () => {
            (await fetchModel<Group[]>('/api/groups'))
                .map(grps => setGroups(grps))
                .mapErr(err => setfetchError(err));
        }
        if (session) {
            fetchData();
        }
    }, [session]); // only update on session change


    const createBet = async (bet: BetFormData) => {
        return (await postModel<Bet>("/api/bets", bet))
            .map(createdBet => router.push(`/groups/${createdBet.groupId}/bets/${createdBet.id}`))
            .mapErr(err => setSubmitError(err))
            .isOk();
    }
    
    return (
        <SecondaryPage title="Add Bet">
            <LoadingSection loading={loading} error={fetchError}>
                <Formik
                    initialValues={{
                        groupId: groupId as string,
                        title: '',
                        description: '',
                        resolutionEvent: '',
                        closeTime: defaultDate(),
                        prediction: true,
                        wager: 0
                    }}
                    validationSchema={Yup.object({
                        title: Yup.string().required("Required"),
                        description: Yup.string().required("Required"),
                        resolutionEvent: Yup.string().required("Required"),
                        wager: Yup.number()
                            .required("Required")
                            .moreThan(0, "Must be greater than 0")
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                        const result = await createBet({ ...values });
                        setSubmitting(false);
                        return result;
                    }}>
                    <Form>
                        <h2>Create Custom Bet</h2>
                        <Select label="Group"
                            name="groupId"
                        >
                            {groups && [emptyGroup].concat(groups).map(group => (
                                <option key={group.id}
                                        value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </Select>
                        <TextInput label="Title"
                            name="title"
                            type="text"
                            placeholder="Title"
                        />
                        <TextAreaInput label="Description"
                            name="description"
                            type="text"
                            placeholder="Enter a description"
                        />
                        <TextInput label="Resolution Description"
                            name="resolutionEvent"
                            placeholder="Describe triggering event"
                        />
                        <DatePickerField label="Close Date"
                            name="closeTime"
                            minTime={new Date()}
                        />
                        <p>No one will be able to bet on this after this date has passed</p>
                        <Select label="Prediction"
                            name="prediction"
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </Select>
                        <TextInput label="Wager"
                            name="wager"
                            type="number"
                        />
                        <button type="submit">Create</button>
                        {submitError && <div className="error">{submitError}</div>}
                    </Form>
                </Formik>
            </LoadingSection>
        </SecondaryPage>
    )
}