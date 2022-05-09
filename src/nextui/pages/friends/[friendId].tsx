import LoadingSection from "@/components/loadingSection";
import SecondaryPage from "@/components/secondaryPage";
import Section from "@/components/section";
import User from "@/models/user";
import { fetchModel } from "@/utils/nodeInterface";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function FriendPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [friend, setFriend] = useState<User>();
    const [fetchError, setError] = useState<string>();

    const { friendId } = router.query;

    useEffect(() => {
        const fetchData = async () => {
            (await fetchModel<User>("/api/fullUser"))
                .map(val => {
                    const f = val.friends.find(x => x.id === friendId);
                    if (f)
                        setFriend(f);
                    else
                        setError(`Could not find friend with ID: ${friendId}`);
                })
                .mapErr(err => setError(err));
        }
        if (session)
            fetchData();
    })

    return (
        <SecondaryPage title={friend?.displayName || "Friend"}>
            <LoadingSection loading={loading}>
                {(friend
                    &&
                    <h3>{friend.displayName}</h3>)
                    ||
                    (fetchError && <div>Error: {fetchError}</div>)
                    ||
                    <></>
                }
            </LoadingSection>
        </SecondaryPage>
    )
}