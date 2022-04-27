import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import NoAuthPage from './noAuthPage'
import AuthPage from './authPage'

interface Props {
	title?: string
	children: React.ReactNode
}

const Page = ({ title, children }: Props) => {
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
        <AuthPage title={title}>
            {children}
        </AuthPage>
    )
};

export default Page
