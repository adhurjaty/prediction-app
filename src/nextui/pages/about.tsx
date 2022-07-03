import NavPage from "@/components/navPage";
import NoAuthNav from "@/components/noAuthNav";
import PrimaryAppBar from "@/components/primaryAppbar";
import { Container, Typography } from "@mui/material";

export default function About() {
    const appBar = <PrimaryAppBar name="About" />
    const bottomNav = <NoAuthNav />
    
    return (
        <NavPage title="About"
            appBar={appBar}
            bottomNav={bottomNav}
        >
            <Container>
                <Typography>
                    About page: details to follow
                </Typography>
            </Container>
        </NavPage>
    );
}