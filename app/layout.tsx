import '../styles/globals.css';
import RootStyleRegistry from './emotions';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head>
                <link rel="manifest" href="manifest.json" />
            </head>
            <body>
                <RootStyleRegistry>{children}</RootStyleRegistry>
            </body>
        </html>
    );
}
