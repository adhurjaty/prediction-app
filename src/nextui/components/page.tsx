import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import NoAuthPage from './noAuthPage'
import AuthPage from './authPage'
import PrimaryNav from './primaryNav'
import { createContext } from 'vm'
import DelphaiInterface from '@/contracts/delphaiInterface'
import FclContext from './FclContext'

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
        <FclContext.Provider value={new DelphaiInterface()}>
            <AuthPage title={title} appBar={appBar} bottomNav={bottomNav ??  <PrimaryNav />}>
                {children}
            </AuthPage>
        </FclContext.Provider>
    )
};

export default Page
