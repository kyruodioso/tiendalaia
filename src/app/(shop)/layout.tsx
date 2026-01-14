'use client'

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Toaster } from 'sonner';
import SmoothScroll from "@/components/SmoothScroll";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SmoothScroll>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <Toaster position="bottom-right" />
    </SmoothScroll>
  )
}
