import { MantineProvider } from '@mantine/core';
import Head from 'next/head';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: any) {
    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme: 'dark',
            }}
        >
            <Head>
                <link rel="manifest" href="manifest.json" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
            </Head>
            <Component {...pageProps} />
        </MantineProvider>
    );
}
