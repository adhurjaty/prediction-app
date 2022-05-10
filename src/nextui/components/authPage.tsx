import Head from 'next/head'
import styled from 'styled-components'

const Main = styled.main`
    margin: 10px;
`;

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

            <Main>
                <div>{children}</div>
            </Main>

            {bottomNav}
        </>
    )
};

export default AuthPage
