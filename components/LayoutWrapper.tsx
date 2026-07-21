'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import RevealInit from './RevealInit';
import PromoBanner from './PromoBanner';
import TrafficInit from './TrafficInit';
import AutoTrack from '@/analytics/AutoTrack';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/site-vc') || pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <RevealInit />
      <PromoBanner />
      <TrafficInit />
      <AutoTrack />
    </>
  );
}
