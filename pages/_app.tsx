import { MantineProvider } from '@mantine/core';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
    return (
        <MantineProvider>
            <Component {...pageProps} />
        </MantineProvider>
    );
}
