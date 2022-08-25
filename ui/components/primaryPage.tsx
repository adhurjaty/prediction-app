import BottomNav from "./bottomNav"
import Page from "./page"
import PrimaryAppBar from "./primaryAppbar"

interface Props {
	title?: string
	children: React.ReactNode
}

const PrimaryPage = ({ title, children }: Props) => {

    const appBar = <PrimaryAppBar name={title} />

    return (
        <Page title={title} appBar={appBar}>
            {children}
        </Page>
    )
}

export default PrimaryPage;