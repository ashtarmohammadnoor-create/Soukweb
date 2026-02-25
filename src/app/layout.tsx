import "./globals.css";
import {cookies} from 'next/headers';
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
  const localeCookie = (await cookies()).get("NEXT_LOCALE")?.value;
  const locale = localeCookie === "ar" ? "ar" : "en";
  const dir = "rtl";

  return (
    <html lang={locale} dir={dir}>
      <body className={`${inter.variable} ${cairo.variable} antialiased`}>{children}</body>
    </html>
  );
}
