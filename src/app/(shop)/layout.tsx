'use client'

import Navbar from "@/components/Navbar";
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
      {children}
      <Toaster position="bottom-right" />
    </SmoothScroll>
  )
}
