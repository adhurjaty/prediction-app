import LoadingSection from "@/components/loadingSection";
import SecondaryPage from "@/components/secondaryPage";
import Section from "@/components/section";
import { Bet } from "@/models/bet";
import { Group } from "@/models/group";
import { fetchModel } from "@/utils/nodeInterface";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

class BetDate {
    public date: Date;

    constructor(date: Date | string) {
        if (typeof date === 'string') {
            this.date = this.fromDateString(date);
        } else {
            this.date = date;
        }
    }

    get dateString(): string {
        // correct for timezone
        return new Date(this.date.getTime()
            - new Date().getTimezoneOffset() * (60 * 1000))
            .toISOString().split('.')[0];
    }

    private fromDateString(dateString: string) {
        return new Date(new Date(dateString+'Z').getTime() + new Date().getTimezoneOffset() * 60000);
    }
}

interface BetFormData {
    groupId?: string;
    title?: string;
    description?: string;
    closeTime: BetDate;
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

export default function AddBetPage() {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [groups, setGroups] = useState<Group[]>();
    const [bet, setBet] = useState<BetFormData>({
        closeTime: new BetDate(defaultDate()),
        wager: 0
    });
    const [isValid, setValid] = useState<boolean>(false);
    const [titleError, setTitleError] = useState<string>();
    const [descriptionError, setDescriptionError] = useState<string>();
    const [resolutionError, setResolutionError] = useState<string>();
    const [closeTimeError, setCloseTimeError] = useState<string>();
    const [wagerError, setWagerError] = useState<string>();

    useEffect(() => {
        const fetchData = async () => {
            (await fetchModel<Group[]>('/api/groups'))
                .map(grps => setGroups(grps));
        }
        if (session) {
            fetchData();
        }
    }, [session]);

    const setSelectedGroup = (newGroupId: string) => {
        setBet({
            ...bet,
            groupId: newGroupId
        });
    };

    const validateTitle = (newTitle?: string) => {
        if (!newTitle) {
            setTitleError("Must enter a title");
            setValid(false);
            return false;
        }
        setTitleError("");
        return true;
    };
    const titleChanged = (newTitle: string) => {
        if (!validateTitle(newTitle)) return;

        setBet({
            ...bet,
            title: newTitle
        });
    };

    const validateDescription = (newDescrition?: string) => {
        if (!newDescrition) {
            setDescriptionError("Must enter a description");
            setValid(false);
            return false;
        }
        setDescriptionError("");
        return true;
    }
    const descriptionChanged = (newDescription: string) => {
        if (!validateDescription(newDescription)) return;

        setBet({
            ...bet,
            description: newDescription
        });
    };

    const validateResolutionDescription = (newResolutionDescription?: string) => {
        if (!newResolutionDescription) {
            setResolutionError("Must enter a resolution description");
            setValid(false);
            return false;
        }
        setResolutionError("");
        return true;
    };
    const resolutionDescriptionChanged = (newResolutionDescription: string) => {
        if (!validateResolutionDescription(newResolutionDescription)) return;

        setBet({
            ...bet,
            resolutionDescription: newResolutionDescription
        });
    };

    const validateCloseTime = (newDateString?: string) => {
        if (!newDateString) {
            setCloseTimeError("Must enter a close time");
            setValid(false);
            return false;
        }
        const closeTime = new BetDate(newDateString);
        if (closeTime.date < new Date()) {
            setCloseTimeError("Must enter a future time");
            setValid(false);
            return false;
        }
        setCloseTimeError("");
        return true;
    }
    const closeTimeChanged = (newDateString: string) => {
        if (!validateCloseTime(newDateString)) return;

        setBet({
            ...bet,
            closeTime: new BetDate(newDateString)
        });
    };

    const validateWager = (newWager: string) => {
        const newWagerNumber = +newWager;
        if (newWagerNumber === NaN) {
            setWagerError("Wager must be a number");
        }
        if (newWagerNumber <= 0) {
            setWagerError("Wager must be greater than 0");
            setValid(false);
            return false;
        }
        setWagerError("");
        return true;
    }
    const setWager = (newWager: string) => {
        if (!validateWager(newWager)) return;

        const newWagerNumber = +newWager;
        setBet({
            ...bet,
            wager: newWagerNumber
        });
    };

    const handleSubmit = () => {
        if (bet.groupId
            && validateTitle(bet.title)
            && validateDescription(bet.description)
            && validateCloseTime(bet.closeTime.dateString)
            && validateResolutionDescription(bet.resolutionDescription)
            && validateWager(`${bet.wager}`))
        {
            
            return true;
        }
        return false;
    }
    
    return (
        <SecondaryPage title="Add Bet">
            <Section>
                <LoadingSection loading={loading}>
                    <>
                    <h2>Create Custom Bet</h2>
                    <form onSubmit={e => handleSubmit()}>
                        <label>Group<span className="required">*</span></label>
                        <select onSelect={e => setSelectedGroup(e.target.value)}
                                required>
                            {groups && groups.map(group => (
                                <option key={group.id}
                                        value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                        <label>Title<span className="required">*</span></label>
                        <input type="text" 
                            placeholder="Title" 
                            value={bet.title}
                            onChange={e => titleChanged(e.target.value)}
                            required />
                        <label>Description<span className="required">*</span></label>
                        <textarea rows={6} 
                                placeholder="Enter description"
                                onChange={e => descriptionChanged(e.target.value)}
                                required>
                            {bet.description}
                        </textarea>
                        <label>Resolution Event<span className="required">*</span></label>
                        <input type="text" 
                                placeholder="describe triggering event"
                                value={bet.resolutionDescription}
                                onChange={e => resolutionDescriptionChanged(e.target.value)}
                                required />
                        <label>Close Date<span className="required">*</span></label>
                        <p>No one will be able to bet on this after this date has passed</p>
                        <input type="datetime-local"
                            value={bet.closeTime.dateString}
                            onChange={e => closeTimeChanged(e.target.value)}
                            required />
                        <label>Prediction<span className="required">*</span></label>
                        <select v-model="wager.prediction">
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                        <label>Wager<span className="required">*</span></label>
                        <input type="number" 
                                value={bet.wager}
                                onChange={e => setWager(e.target.value)}
                                required />
                        <input type="submit"
                                value="create" />
                    </form >
                    </>
                </LoadingSection>
            </Section>
        </SecondaryPage>
    )
}