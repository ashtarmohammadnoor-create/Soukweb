import "./globals.css";
import {headers} from 'next/headers';
import { Inter, Cairo } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  const locale = (await headers()).get('x-locale') ?? 'en';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className={`${inter.variable} ${cairo.variable}`}>{children}</body>
    </html>
  );
}
