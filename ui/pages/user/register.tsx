import NavPage from '../../components/navPage'
import PrimaryAppBar from '../../components/primaryAppbar'
import BottomNav from '../../components/bottomNav'
import { Container, Stack, Typography} from '@mui/material'
import User from "@/models/user";
import { postModel } from '@/utils/nodeInterface';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DelphaiInterface from '@/contracts/delphaiInterface';
import UserValuesForm from '@/components/user/userValuesForm';
import { errAsync } from 'neverthrow';

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
        return (await postModel<User>("/api/user", user)
            .mapErr(err => setSubmitError(err))
            .andThen(_ => {
                if (!delphai) return errAsync("Could not initialize Delphai");
                return delphai.saveDelphaiUser()
                    .map(_ => router.push("/groups"))
                    .mapErr(err => setSubmitError(err))
            }))
            .isOk();
    }

    return (
        <NavPage title="Register"
            appBar={appBar}
            bottomNav={bottomNav}
        >
            <Container>
                <Stack
                    spacing={1}
                    direction="column"
                >
                    <UserValuesForm
                        onSubmit={createUser}
                        submitError={submitError}
                        titleText="User Registration"
                        buttonText="Register"
                    />
                    <>
                        <Typography variant="body1">
                            How to create a Flow account
                        </Typography>
                        <ol>
                            <li>Get a <a href="https://portto.com/" target="_blank" rel="noreferrer">Blocto Wallet</a> &#40;must do this on mobile&#41;</li>
                            <li>Go to the <a href="https://flow-port-staging.vercel.app/" target="_blank" rel="noreferrer">Testnet Flow Port</a></li>
                            <li>Click Sign In. You should be prompted with a Blocto modal to sign into Blocto</li>
                            <li>Follow the steps to sign into Blocto</li>
                            <li>In the FLow Port, go to the Dashboard tab. Under FUSD Balance, click Set Up FUSD</li>
                            <li>Click the Connect Flow Account button</li>
                            <li>Before you click &lsquo;Register&lsquo;, you will need currency to use the app. Follow the instructions below</li>
                        </ol>
                        <Typography variant="body1">
                            Getting Flow and FUSD
                        </Typography>
                        <ol>
                            <li>Go to the <a href="https://testnet-faucet.onflow.org/fund-account" target="_blank" rel="noreferrer">testnet faucet</a></li>
                            <li>Enter in your Flow testnet address</li>
                            <li>Select Testnet FLOW in the dropdown</li>
                            <li>Click Fund Account</li>
                            <li>Refresh the page and repeat steps 2 - 4, but for step 3, change the dropdown option to FUSD</li>
                        </ol>
                    </>
                </Stack>
            </Container>
        </NavPage>
    )
}