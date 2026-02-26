import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Optimrental - Car Rental & Shuttle",
    description: "Affordable rates • Top-notch service • Switzerland",
    icons: {
        icon: [{ url: '/optimrental-logo.png', type: 'image/png' }],
        shortcut: '/favicon.ico',
        apple: '/optimrental-logo.png',
    }
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
            <head>
                <link rel="icon" type="image/png" href="/optimrental-logo.png" />
                <link rel="shortcut icon" type="image/png" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/optimrental-logo.png" />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-50 text-slate-900`} suppressHydrationWarning>
                <NextIntlClientProvider messages={messages}>
                    {children}
                    <Toaster />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
