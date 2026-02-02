import Hero from '@/components/Hero'
import BottomSection from '@/components/BottomSection'
import Services from '@/components/Services'
import PricingPackages from '@/components/PricingPackages'
import CTASection from '@/components/CTASection'

export default function Home() {
  return (
    <>
      <Hero />
      <BottomSection />
      <Services />
      <PricingPackages />
      <CTASection />
    </>
  )
}