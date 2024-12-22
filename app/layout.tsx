// app/layout.tsx

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Ensure global styles are applied

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Your Page Title</title>
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-black`}
        >
        {/* Render the children (page content) here */}
        {children}
        </body>
        </html>
    );
}
