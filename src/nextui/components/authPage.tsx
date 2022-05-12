import Head from 'next/head'
import styled from 'styled-components'

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

            <main>
                <div>{children}</div>
            </main>

            {bottomNav}
        </>
    )
};

export default AuthPage
