import Page from "@/components/page";
import Section from "@/components/section";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function GroupsPage() {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [groups, setGroups] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/examples/groups');
            const response = await res.json();
            debugger;
        }
        fetchData();
    }, [session]);

    return (
        <Page>
            <Section>
                <h1>Groups Page</h1>
            </Section>
        </Page>
    )
}