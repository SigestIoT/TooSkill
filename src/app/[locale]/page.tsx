import Hero from '@/components/home/Hero'
import TrustBar from '@/components/home/TrustBar'
import WhyTooSkill from '@/components/home/WhyTooSkill'
import HowItWorks from '@/components/home/HowItWorks'
import TrainingLevels from '@/components/home/TrainingLevels'
import StatsSection from '@/components/home/StatsSection'
import FeaturedCourses from '@/components/home/FeaturedCourses'
import CtaSection from '@/components/home/CtaSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <WhyTooSkill />
      <HowItWorks />
      <TrainingLevels />
      <StatsSection />
      <FeaturedCourses />
      <CtaSection />
    </>
  )
}
