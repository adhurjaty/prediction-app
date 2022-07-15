import BottomNav from "./bottom-nav"
import Page from "./page"
import PrimaryNav from "./primaryNav"
import SecondaryAppBar from "./secondaryAppbar"

interface Props {
	title?: string
    children: React.ReactNode
    navLinks?: {
        label: string;
        href: string;
        icon: JSX.Element;
    }[]
}

const SecondaryPage = ({ title, children, navLinks }: Props) => {

    const appBar = <SecondaryAppBar name={title} />

    const bottomNav = navLinks
        ? <BottomNav links={navLinks} />
        : <PrimaryNav />;

    return (
        <Page title={title} appBar={appBar} bottomNav={bottomNav}>
            {children}
        </Page>
    )
}

export default SecondaryPage;