import '@fontsource-variable/m-plus-1-code';
import './globals.css';

export const metadata = {
    title: 'EPCalendar Server',
    description: 'Server for EPCalendar',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja">
            <body>
                {children}
            </body>
        </html>
    );
}
