import NavPage from '../../components/navPage'
import PrimaryAppBar from '../../components/primaryAppbar'
import BottomNav from '../../components/bottom-nav'
import { Container} from '@mui/material'
import User from "@/models/user";
import { postModel } from '@/utils/nodeInterface';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DelphaiInterface from '@/contracts/delphaiInterface';
import UserValuesForm from '@/components/user/userValuesForm';

interface UserFormData {
    displayName: string;
    flowAddress: string;
}

export default function Register() {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string>();
    const [delphai, setDelphai] = useState<DelphaiInterface>();

    useEffect(() => {
        setDelphai(new DelphaiInterface());
    }, []);
    
    const appBar = <PrimaryAppBar name="Register" />
    const navLinks = [
        {
            label: "About",
            href: "/about",
            icon: (
                <div>About</div>
            )
        }
    ]
    const bottomNav = <BottomNav links={navLinks} />

    const createUser = async (user: UserFormData) => {
        const result = (await postModel<User>("/api/user", user))
            .mapErr(err => setSubmitError(err))
            .map(async _ => {
                if (!delphai) return false;
                return (await delphai.saveDelphaiUser())
                    .map(_ => router.push("/groups"))
                    .mapErr(err => setSubmitError(err))
                    .isOk();
            });
        return result.isOk() && result.unwrap();
    }

    return (
        <NavPage title="Register"
            appBar={appBar}
            bottomNav={bottomNav}
        >
            <Container>
                <UserValuesForm
                    onSubmit={createUser}
                    submitError={submitError}
                />
            </Container>
        </NavPage>
    )
}