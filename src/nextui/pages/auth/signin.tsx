import BottomNav from "@/components/bottom-nav";
import NavPage from "@/components/navPage";
import PrimaryAppBar from "@/components/primaryAppbar";
import { Button, Container, Stack, Typography } from "@mui/material";
import { CtxOrReq } from "next-auth/client/_utils";
import { Provider } from "next-auth/providers";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignIn({ providers }: { providers: Provider[] }) {
    const navLinks = [
        {
            label: "Signin",
            href: "/auth/signin",
            icon: (<div>Signin</div>)
        },
        {
            label: "About",
            href: "/about",
            icon: (<div>About</div>)
        }
    ];

    const appBar = <PrimaryAppBar name="Signup" />
    const bottomNav = <BottomNav links={navLinks} />

    const router = useRouter();
    const callbackUrl = (router.query.redirectUrl as string) ?? "/groups"

    return (
        <NavPage title={"Signup"}
            appBar={appBar}
            bottomNav={bottomNav}
        >
            <Container>
                <Stack spacing={1}
                    marginTop={1}>
                    <Typography>
                        Welcome to Delphai! Sign In here
                    </Typography>
                    {Object.values(providers).map((provider) => (
                        <Container key={provider.name}>
                            <Button variant="contained"
                                onClick={() => signIn(provider.id, {
                                    callbackUrl
                                })}
                            >
                                Sign in with {provider.name}
                            </Button>
                        </Container>
                    ))}
                </Stack>
            </Container>
        </NavPage>
    )
}

export async function getServerSideProps(context: CtxOrReq) {
    const providers = await getProviders()
    const csrfToken = await getCsrfToken(context)
    return {
        props: {
            providers,
            csrfToken
        },
    }
}