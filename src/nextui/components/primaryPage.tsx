import AuthPage from "./authPage"
import PrimaryAppBar from "./primaryAppbar"

interface Props {
	title?: string
	children: React.ReactNode
}

const PrimaryPage = ({ title, children }: Props) => {

    const appBar = <PrimaryAppBar name={title} />

    return (
        <AuthPage title={title} appBar={appBar}>
            {children}
        </AuthPage>
    )
}

export default PrimaryPage;