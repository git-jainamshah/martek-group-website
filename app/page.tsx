import Hero from '@/components/Hero'
import TrustRow from '@/components/home/TrustRow'
import WhatWeDo from '@/components/home/WhatWeDo'
import HowWeWork from '@/components/home/HowWeWork'
import Proof from '@/components/home/Proof'
import PricingSection from '@/components/home/PricingSection'
import MiniCta from '@/components/home/MiniCta'
import FinalCta from '@/components/home/FinalCta'
import HomeBlogStrip from '@/components/blog/HomeBlogStrip'
import { getSlots } from '@/lib/media-slots-server'

export default async function Home() {
  const slots = await getSlots()
  return (
    <>
      <Hero videoSrc={slots['home-hero-video']} />
      <TrustRow />
      <WhatWeDo />
      <HowWeWork />
      <Proof imageSrc={slots['home-proof-image']} />
      <PricingSection />
      <MiniCta imageSrc={slots['home-minicta-image']} />
      <HomeBlogStrip />
      <FinalCta />
    </>
  )
}
