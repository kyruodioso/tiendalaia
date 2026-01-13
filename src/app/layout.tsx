import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });
const oswald = Oswald({ subsets: ["latin"], variable: '--font-oswald' });

export const metadata: Metadata = {
  title: "Laia Store",
  description: "Urban & Vintage Collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${oswald.variable}`}>
        {children}
      </body>
    </html>
  );
}
