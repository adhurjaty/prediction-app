import Head from 'next/head'
import BottomNav from '@/components/bottom-nav'

interface Props {
	title?: string
    children: React.ReactNode
    appBar: JSX.Element
    bottomNav: JSX.Element
}

const AuthPage = ({ title, children, appBar, bottomNav }: Props) => {
    return (
        <>
            {title ? (
                <Head>
                    <title>{title}</title>
                </Head>
            ) : null}

            {appBar}

            <main
                /**
                 * Padding top = `appbar` height
                 * Padding bottom = `bottom-nav` height
                 */
                className='mx-auto px-safe pt-20 pb-16 sm:pb-0 max-w-screen-md'
            >
                <div className='p-6'>{children}</div>
            </main>

            {bottomNav}
        </>
    )
};

export default AuthPage
