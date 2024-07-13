import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import QueryProviders from "../providers/queryProviders";
import { Toaster } from "../components/ui/sonner";

import { Inter } from "next/font/google";
import "./globals.css";
import NewAccountSheetProvider from "@/providers/newAccountSheetProvider";

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
          <QueryProviders>
            <NewAccountSheetProvider />
            <Toaster />
            {children}
          </QueryProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
