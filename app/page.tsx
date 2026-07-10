import Hero from '@/components/Hero'
import TrustRow from '@/components/home/TrustRow'
import WhatWeDo from '@/components/home/WhatWeDo'
import HowWeWork from '@/components/home/HowWeWork'
import Proof from '@/components/home/Proof'
import PricingSection from '@/components/home/PricingSection'
import MiniCta from '@/components/home/MiniCta'
import FinalCta from '@/components/home/FinalCta'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustRow />
      <WhatWeDo />
      <HowWeWork />
      <Proof />
      <PricingSection />
      <MiniCta />
      <FinalCta />
    </>
  )
}
