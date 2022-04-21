import Head from 'next/head'
import Appbar from '@/components/appbar'
import BottomNav from '@/components/bottom-nav'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

interface Props {
	title?: string
	children: React.ReactNode
}

const Page = ({ title, children }: Props) => {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const router = useRouter();

    if (!session && !loading) {
        router.push({
            pathname: "/api/auth/signin",
            query: { returnUrl: router.asPath }
        });
        return;   
    }
    return (
        <>
            {title ? (
                <Head>
                    <title>Rice Bowl | {title}</title>
                </Head>
            ) : null}

            <Appbar />

            <main
                /**
                 * Padding top = `appbar` height
                 * Padding bottom = `bottom-nav` height
                 */
                className='mx-auto px-safe pt-20 pb-16 sm:pb-0 max-w-screen-md'
            >
                <div className='p-6'>{children}</div>
            </main>

            <BottomNav />
        </>
    )
};

export default Page
