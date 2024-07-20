import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import QueryProviders from "@/providers/queryProviders";
import NewAccountSheetProvider from "@/providers/newAccountSheetProvider";
import NewCategorySheetProvider from "@/providers/newCategorySheetProvider";

import { Toaster } from "@/components/ui/sonner";

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
          <QueryProviders>
            <NewAccountSheetProvider />
            <NewCategorySheetProvider />
            <Toaster />
            {children}
          </QueryProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
