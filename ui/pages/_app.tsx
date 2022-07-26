import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from "next-auth/react"
import Meta from '@/components/meta'
import '@/styles/globals.scss'

const App = ({ Component, pageProps }: AppProps) => {
    
    return (
        <SessionProvider session={pageProps.session} refetchInterval={0}>
            <ThemeProvider
                attribute='class'
                defaultTheme='light'
                disableTransitionOnChange
            >
                <Meta />
                <Component {...pageProps} />
            </ThemeProvider>
        </SessionProvider>
		
	)
}

export default App
