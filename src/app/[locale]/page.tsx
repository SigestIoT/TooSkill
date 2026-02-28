import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import TrustBar from '@/components/home/TrustBar'
import WhyTooSkill from '@/components/home/WhyTooSkill'
import HowItWorks from '@/components/home/HowItWorks'
import TrainingLevels from '@/components/home/TrainingLevels'
import StatsSection from '@/components/home/StatsSection'
import FeaturedCourses from '@/components/home/FeaturedCourses'
import CtaSection from '@/components/home/CtaSection'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('hero')
  return {
    title: 'TooSkill — Formazione SAP Professionale',
    description: t('subheadline'),
    openGraph: { title: 'TooSkill — Formazione SAP Professionale', description: t('subheadline') },
  }
}

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
