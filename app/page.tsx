import Hero from '@/components/Hero'
import Services from '@/components/Services'
import WhyChooseUs from '@/components/WhyChooseUs'
import PricingPackages from '@/components/PricingPackages'
import CTASection from '@/components/CTASection'
import Testimonials from '@/components/Testimonials'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <WhyChooseUs />
      <PricingPackages />
      <Testimonials />
      <CTASection />
    </>
  )
}
