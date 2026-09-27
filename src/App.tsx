import { lazy, Suspense, type ReactNode } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { TooltipProvider } from '@/components/ui/Tooltip'
import { Loading } from '@/components/ui'
import { Navbar } from '@/components/navigation'
import { Footer } from '@/components/layout'
import { ScrollToTop, PageTransition, RequireAuth } from '@/components/shared'
import { IntroProvider, IntroSequence } from '@/components/intro'
import { useIntro } from '@/hooks/useIntro'
import { ROUTES } from '@/constants/routes'

import Home from '@/pages/Home'
import About from '@/pages/About'
import Projects from '@/pages/Projects'
import ProjectDetail from '@/pages/ProjectDetail'
import Certificates from '@/pages/Certificates'
import CertificateDetail from '@/pages/CertificateDetail'
import Achievements from '@/pages/Achievements'
import Journey from '@/pages/Journey'
import Contact from '@/pages/Contact'
import Resume from '@/pages/Resume'
import NotFound from '@/pages/NotFound'

/*
 * Phase 10 performance: the admin CMS (layout, forms, tables) is split
 * into its own chunks. Public visitors never download it; the admin
 * routes, auth guard and behavior are otherwise unchanged.
 */
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const AdminLogin = lazy(() => import('@/pages/admin/Login'))
const AdminOverview = lazy(() => import('@/pages/admin/Overview'))
const AdminNotFound = lazy(() => import('@/pages/admin/AdminNotFound'))
const ProjectList = lazy(() => import('@/pages/admin/projects/ProjectList'))
const ProjectForm = lazy(() => import('@/pages/admin/projects/ProjectForm'))
const CertificateList = lazy(() => import('@/pages/admin/certificates/CertificateList'))
const CertificateForm = lazy(() => import('@/pages/admin/certificates/CertificateForm'))
const AchievementList = lazy(() => import('@/pages/admin/achievements/AchievementList'))
const AchievementForm = lazy(() => import('@/pages/admin/achievements/AchievementForm'))
const JourneyList = lazy(() => import('@/pages/admin/journey/JourneyList'))
const JourneyForm = lazy(() => import('@/pages/admin/journey/JourneyForm'))
const SkillList = lazy(() => import('@/pages/admin/skills/SkillList'))
const SkillForm = lazy(() => import('@/pages/admin/skills/SkillForm'))
const EducationList = lazy(() => import('@/pages/admin/education/EducationList'))
const EducationForm = lazy(() => import('@/pages/admin/education/EducationForm'))
const ExperienceList = lazy(() => import('@/pages/admin/experience/ExperienceList'))
const ExperienceForm = lazy(() => import('@/pages/admin/experience/ExperienceForm'))
const SettingsPage = lazy(() => import('@/pages/admin/settings/SettingsPage'))

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loading label="Loading" />
    </div>
  )
}

/** Suspense boundary per lazy route so the admin shell never flashes out on navigation. */
function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}

/**
 * Scroll resets happen once the outgoing page has faded out (not the
 * moment the URL changes), so the old page never visibly jumps to the
 * top mid-transition. Hash targets are handled by <ScrollToTop />.
 */
function resetScroll() {
  if (window.location.hash) return
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
}

function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={resetScroll}>
      <Routes location={location} key={location.pathname}>
        <Route
          path={ROUTES.home}
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.about}
          element={
            <PageTransition>
              <About />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.projects}
          element={
            <PageTransition>
              <Projects />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.projectDetail()}
          element={
            <PageTransition>
              <ProjectDetail />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.certificates}
          element={
            <PageTransition>
              <Certificates />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.certificateDetail()}
          element={
            <PageTransition>
              <CertificateDetail />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.achievements}
          element={
            <PageTransition>
              <Achievements />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.journey}
          element={
            <PageTransition>
              <Journey />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.contact}
          element={
            <PageTransition>
              <Contact />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.resume}
          element={
            <PageTransition>
              <Resume />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.adminLogin}
          element={
            <PageTransition>
              <Lazy>
                <AdminLogin />
              </Lazy>
            </PageTransition>
          }
        />

        {/* Admin CMS — everything under here is authenticated and uses AdminLayout instead of the public shell. */}
        <Route
          path={ROUTES.admin}
          element={
            <RequireAuth>
              <Lazy>
                <AdminLayout />
              </Lazy>
            </RequireAuth>
          }
        >
          <Route index element={<Lazy><AdminOverview /></Lazy>} />

          <Route path="projects" element={<Lazy><ProjectList /></Lazy>} />
          <Route path="projects/new" element={<Lazy><ProjectForm /></Lazy>} />
          <Route path="projects/:id/edit" element={<Lazy><ProjectForm /></Lazy>} />

          <Route path="certificates" element={<Lazy><CertificateList /></Lazy>} />
          <Route path="certificates/new" element={<Lazy><CertificateForm /></Lazy>} />
          <Route path="certificates/:id/edit" element={<Lazy><CertificateForm /></Lazy>} />

          <Route path="achievements" element={<Lazy><AchievementList /></Lazy>} />
          <Route path="achievements/new" element={<Lazy><AchievementForm /></Lazy>} />
          <Route path="achievements/:id/edit" element={<Lazy><AchievementForm /></Lazy>} />

          <Route path="journey" element={<Lazy><JourneyList /></Lazy>} />
          <Route path="journey/new" element={<Lazy><JourneyForm /></Lazy>} />
          <Route path="journey/:id/edit" element={<Lazy><JourneyForm /></Lazy>} />

          <Route path="skills" element={<Lazy><SkillList /></Lazy>} />
          <Route path="skills/new" element={<Lazy><SkillForm /></Lazy>} />
          <Route path="skills/:id/edit" element={<Lazy><SkillForm /></Lazy>} />

          <Route path="education" element={<Lazy><EducationList /></Lazy>} />
          <Route path="education/new" element={<Lazy><EducationForm /></Lazy>} />
          <Route path="education/:id/edit" element={<Lazy><EducationForm /></Lazy>} />

          <Route path="experience" element={<Lazy><ExperienceList /></Lazy>} />
          <Route path="experience/new" element={<Lazy><ExperienceForm /></Lazy>} />
          <Route path="experience/:id/edit" element={<Lazy><ExperienceForm /></Lazy>} />

          <Route path="settings" element={<Lazy><SettingsPage /></Lazy>} />

          <Route path="*" element={<Lazy><AdminNotFound /></Lazy>} />
        </Route>

        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

function AppShell() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const { phase } = useIntro()
  const introActive = phase === 'playing'

  return (
    <TooltipProvider>
      {!isAdminRoute && (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2.5 focus:text-body-sm focus:font-medium focus:text-accent-ink"
        >
          Skip to content
        </a>
      )}

      {/* While the intro is on screen the page underneath stays in the DOM (SEO) but is inert. */}
      <div className="flex min-h-dvh flex-col" inert={introActive}>
        <ScrollToTop />
        {!isAdminRoute && <Navbar />}
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          <AppRoutes />
        </main>
        {!isAdminRoute && <Footer />}
      </div>

      {!isAdminRoute && <IntroSequence />}
    </TooltipProvider>
  )
}

export default function App() {
  return (
    <IntroProvider>
      <MotionConfig reducedMotion="user">
        <AppShell />
      </MotionConfig>
    </IntroProvider>
  )
}
