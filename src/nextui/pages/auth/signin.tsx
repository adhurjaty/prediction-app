import BottomNav from "@/components/bottom-nav";
import NavPage from "@/components/navPage";
import PrimaryAppBar from "@/components/primaryAppbar";
import { Button, Container, Stack, Typography } from "@mui/material";

export default function SigninPage() {
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
                    <Button variant="contained">Sign In</Button>
                </Stack>
            </Container>
        </NavPage>
    )
}