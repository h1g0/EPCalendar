import "./globals.css";

export const metadata = {
    title: "EPCalendar Server",
    description: "Server for EPCalendar",
    robots: "noindex, nofollow",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
