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

/**
 * One continuous narrative, numbered where numbering helps:
 * Hero → Snapshot → 01 Selected work (+ further case studies) →
 * 02 Skills → 03 Certificates → 04 Achievements → 05 Journey →
 * 06 Education → 07 GitHub → 08 Problem solving → 09 Contact.
 */
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
      <EducationSection />
      <GitHubActivity />
      <CodingDSA />
      <ContactSection />
    </>
  )
}
