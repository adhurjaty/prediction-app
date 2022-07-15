import { useSession } from 'next-auth/react'
import NoAuthPage from './noAuthPage'
import NavPage from './navPage'
import PrimaryNav from './primaryNav'

interface Props {
	title?: string
    children: React.ReactNode
    appBar: JSX.Element
    bottomNav?: JSX.Element
}


const Page = ({ title, children, appBar, bottomNav }: Props) => {
    const { data: session, status } = useSession();
    const loading = status === "loading";

    if (loading) {
        return <div>Loading...</div>
    }

    if (!session && !loading) {
        return (
            <NoAuthPage />
        )    
    }

    return (
        <NavPage title={title} appBar={appBar} bottomNav={bottomNav ??  <PrimaryNav />}>
            {children}
        </NavPage>
    )
};

export default Page
