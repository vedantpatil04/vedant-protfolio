import { usePageTitle } from '@/hooks/usePageTitle'
import {
  Hero,
  DeveloperSnapshot,
  FeaturedProjects,
  CaseStudies,
  TechStack,
  CertificateVault,
  AchievementsSection,
  DeveloperJourney,
  CodingDSA,
  GitHubActivity,
  EducationSection,
  ContactSection,
} from '@/sections'

export default function Home() {
  usePageTitle()

  return (
    <>
      <Hero />
      <DeveloperSnapshot />
      <FeaturedProjects />
      <CaseStudies />
      <TechStack />
      <CertificateVault />
      <AchievementsSection />
      <DeveloperJourney />
      <CodingDSA />
      <GitHubActivity />
      <EducationSection />
      <ContactSection />
    </>
  )
}
