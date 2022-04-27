import Page from "./page"
import SecondaryAppBar from "./secondaryAppbar"

interface Props {
	title?: string
	children: React.ReactNode
}

const SecondaryPage = ({ title, children }: Props) => {

    const appBar = <SecondaryAppBar name={title} />

    return (
        <Page title={title} appBar={appBar}>
            {children}
        </Page>
    )
}

export default SecondaryPage;