import LoadingSection from "@/components/loadingSection";
import SecondaryPage from "@/components/secondaryPage";
import Section from "@/components/section";
import { Group } from "@/models/group";
import { postModel } from "@/utils/nodeInterface";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function CreateGroupPage() {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [groupName, setGroupName] = useState<string | undefined>();
    const [groupNameError, setGroupNameError] = useState<string | undefined>();
    const [submitError, setSubmitError] = useState<string>();

    const router = useRouter();

    const validateGroupName = (newGroupName?: string) => {
        if (!newGroupName) {
            setGroupNameError("Must enter a group name");
            return false;
        }
        setGroupNameError(undefined);
        return true;
    }
    const onGroupNameChanged = (newGroupName: string) => {
        if (!validateGroupName(newGroupName)) return;
        setGroupName(newGroupName);
    }

    const handleSubmit = async () => {
        if (!validateGroupName(groupName)) {
            return false;
        }

        return (await postModel<Group>("/api/groups", { name: groupName }))
            .map(group => router.push(`/groups/${group.id}`))
            .mapErr(err => setSubmitError(err))
            .isOk();
    }

    return (
        <SecondaryPage title="Create new group">
            <Section>
                <LoadingSection loading={loading}>
                    <form onSubmit={e => handleSubmit()}>
                        <h2>Create New Group</h2>
                        <input type="text"
                                onChange={e => onGroupNameChanged(e.target.value)}
                                placeholder="Group name" />
                        <input type="submit"
                                value="create" />
                    </form>
                </LoadingSection>
            </Section>
        </SecondaryPage>
    )
}