import "./globals.css";
import {headers} from 'next/headers';
import { Inter, Cairo } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  fallback: ["Segoe UI", "Tahoma", "Arial", "sans-serif"],
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-ar",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  const locale = (await headers()).get('x-locale') ?? 'en';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className={`${inter.variable} ${cairo.variable} antialiased`}>{children}</body>
    </html>
  );
}
