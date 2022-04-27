import AuthPage from "./authPage"
import SecondaryAppBar from "./secondaryAppbar"

interface Props {
	title?: string
	children: React.ReactNode
}

const SecondaryPage = ({ title, children }: Props) => {

    const appBar = <SecondaryAppBar name={title} />

    return (
        <AuthPage title={title} appBar={appBar}>
            {children}
        </AuthPage>
    )
}

export default SecondaryPage;