import { DatePickerInput, SelectInput, TextAreaInput, TextInput } from "@/components/formFields";
import LoadingSection from "@/components/loadingSection";
import SecondaryPage from "@/components/secondaryPage";
import { Bet } from "@/models/bet";
import { Group } from "@/models/group";
import { fetchModel, postModel } from "@/utils/nodeInterface";
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from 'yup';

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
                        <SelectInput label="Group"
                            name="groupId"
                        >
                            {groups && [emptyGroup].concat(groups).map(group => (
                                <option key={group.id}
                                        value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </SelectInput>
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
                        <DatePickerInput label="Close Date"
                            name="closeTime"
                            minTime={new Date()}
                            dateFormat="yyyy-MM-dd HH:mm"
                        />
                        <p>No one will be able to bet on this after this date has passed</p>
                        <SelectInput label="Prediction"
                            name="prediction"
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </SelectInput>
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