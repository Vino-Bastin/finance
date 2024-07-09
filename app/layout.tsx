import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProviders from "../providers/queryProviders";

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Finance",
    description: "Finance",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={inter.className}>
                    <QueryProviders>{children}</QueryProviders>
                </body>
            </html>
        </ClerkProvider>
    );
}
