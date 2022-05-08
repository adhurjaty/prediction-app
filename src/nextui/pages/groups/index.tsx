import LoadingSection from "@/components/loadingSection";
import PrimaryPage from "@/components/primaryPage";
import Section from "@/components/section";
import { Circle, CircleInner, CircleSvg } from "@/components/styled"
import { Group } from "@/models/group";
import { fetchModel } from "@/utils/nodeInterface";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";

const GroupsList = styled.div`
    @include iconWithData;

    .title {
        font-weight: bold;
        color: #b644bd;
    }
`;

const GroupCircleSvg = styled(CircleSvg)`
    width: 40px;
`;

export default function GroupsPage() {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [groups, setGroups] = useState<Group[]>();
    const [fetchError, setError] = useState<string>();

    useEffect(() => {
        const fetchData = async () => {
            (await fetchModel<Group[]>('/api/groups'))
                .map(val => setGroups(val))
                .mapErr(err => setError(err));
        }
        if (session) {
            fetchData();
        }
    }, [session]);

    return (
        <PrimaryPage title="Groups">
            <Section>
                <LoadingSection loading={loading} error={fetchError}>
                    <GroupsList>
                        {(groups?.length && groups.map(group => (
                            <Link key={group.id} href={`/groups/${group.id}`} passHref>
                                <div>
                                    <Circle>
                                        <CircleInner>
                                            <GroupCircleSvg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20"><path d="M10.118 16.064c2.293-.529 4.428-.993 3.394-2.945-3.146-5.942-.834-9.119 2.488-9.119 3.388 0 5.644 3.299 2.488 9.119-1.065 1.964 1.149 2.427 3.394 2.945 1.986.459 2.118 1.43 2.118 3.111l-.003.825h-15.994c0-2.196-.176-3.407 2.115-3.936zm-10.116 3.936h6.001c-.028-6.542 2.995-3.697 2.995-8.901 0-2.009-1.311-3.099-2.998-3.099-2.492 0-4.226 2.383-1.866 6.839.775 1.464-.825 1.812-2.545 2.209-1.49.344-1.589 1.072-1.589 2.333l.002.619z"/></GroupCircleSvg>
                                        </CircleInner>
                                    </Circle>
                                    <div className="text-info">
                                        <p className="title">{ group.name }</p>
                                        <p>{ group.accuracy }% accurate</p>
                                        <p>{ group.betsMade }/{ group.betsAvailable } active bets</p>  
                                    </div>
                                </div>
                            </Link>
                        )))
                        ||
                        <div>No groups</div>}
                    </GroupsList>
                </LoadingSection>
            </Section>
        </PrimaryPage>
    )
}