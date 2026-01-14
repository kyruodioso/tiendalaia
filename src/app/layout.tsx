import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });
const oswald = Oswald({ subsets: ["latin"], variable: '--font-oswald' });

export const metadata: Metadata = {
  metadataBase: new URL('https://tiendalaia.vercel.app'), // Reemplazar con tu dominio real
  title: {
    default: "Laia | Moda Vintage & Urbana",
    template: "%s | Laia"
  },
  description: "Descubrí lo último en moda urbana y vintage. Estilo que define tu identidad. Envíos a todo el país.",
  keywords: ["moda", "vintage", "urbana", "ropa", "argentina", "sustentable"],
  authors: [{ name: "Laia Store" }],
  creator: "Laia Store",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://tiendalaia.vercel.app",
    title: "Laia | Moda Vintage & Urbana",
    description: "Descubrí lo último en moda urbana y vintage. Estilo que define tu identidad.",
    siteName: "Laia Store",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Laia Store - Moda Vintage & Urbana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Laia | Moda Vintage & Urbana",
    description: "Descubrí lo último en moda urbana y vintage. Estilo que define tu identidad.",
    images: ["/og-image.png"],
    creator: "@laia23store",
  },
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${oswald.variable}`}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
