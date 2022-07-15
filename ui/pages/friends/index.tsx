import LoadingSection from "@/components/loadingSection";
import PrimaryPage from "@/components/primaryPage";
import { Circle, CircleInner } from "@/components/styled";
import User from "@/models/user";
import { fetchModel } from "@/utils/nodeInterface";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function FriendsPage() {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [friends, setFriends] = useState<User[]>();
    const [fetchError, setError] = useState<string>();

    useEffect(() => {
        const fetchData = async () => {
            (await fetchModel<User>('/api/fullUser'))
                .map(val => setFriends(val.friends))
                .mapErr(err => setError(err));
        }
        if (session) {
            fetchData();
        }
    }, [session]);

    return (
        <PrimaryPage title="Friends">
            <LoadingSection loading={loading && !friends} error={fetchError}>
                {(friends?.length &&
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {friends.map(friend => (
                            <ListItem key={friend.id}
                                alignItems="flex-start"
                                sx={{ width: '100%' }}
                            >
                                <ListItemButton component="a"
                                    href={`/friends/${friend.id}`}>
                                    <ListItemIcon>
                                        <Circle>
                                            <CircleInner>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20"><path d="M10.118 16.064c2.293-.529 4.428-.993 3.394-2.945-3.146-5.942-.834-9.119 2.488-9.119 3.388 0 5.644 3.299 2.488 9.119-1.065 1.964 1.149 2.427 3.394 2.945 1.986.459 2.118 1.43 2.118 3.111l-.003.825h-15.994c0-2.196-.176-3.407 2.115-3.936zm-10.116 3.936h6.001c-.028-6.542 2.995-3.697 2.995-8.901 0-2.009-1.311-3.099-2.998-3.099-2.492 0-4.226 2.383-1.866 6.839.775 1.464-.825 1.812-2.545 2.209-1.49.344-1.589 1.072-1.589 2.333l.002.619z" /></svg>
                                            </CircleInner>
                                        </Circle>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={friend.displayName}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))} 
                    </List>)
                    ||
                    <h2>You have no friends</h2>}
            </LoadingSection>
        </PrimaryPage>
    )
}