import Head from 'next/head'

interface Props {
	title?: string
    children: React.ReactNode
    appBar: JSX.Element
    bottomNav: JSX.Element
}

const NavPage = ({ title, children, appBar, bottomNav }: Props) => {
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

export default NavPage
