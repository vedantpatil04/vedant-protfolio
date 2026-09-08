import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { TooltipProvider } from '@/components/ui/Tooltip'
import { Navbar } from '@/components/navigation'
import { Footer } from '@/components/layout'
import { ScrollToTop, PageTransition, RequireAuth } from '@/components/shared'
import { AdminLayout } from '@/components/admin'
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
import AdminLogin from '@/pages/admin/Login'
import AdminOverview from '@/pages/admin/Overview'
import AdminNotFound from '@/pages/admin/AdminNotFound'
import ProjectList from '@/pages/admin/projects/ProjectList'
import ProjectForm from '@/pages/admin/projects/ProjectForm'
import CertificateList from '@/pages/admin/certificates/CertificateList'
import CertificateForm from '@/pages/admin/certificates/CertificateForm'
import AchievementList from '@/pages/admin/achievements/AchievementList'
import AchievementForm from '@/pages/admin/achievements/AchievementForm'
import JourneyList from '@/pages/admin/journey/JourneyList'
import JourneyForm from '@/pages/admin/journey/JourneyForm'
import SkillList from '@/pages/admin/skills/SkillList'
import SkillForm from '@/pages/admin/skills/SkillForm'
import EducationList from '@/pages/admin/education/EducationList'
import EducationForm from '@/pages/admin/education/EducationForm'
import ExperienceList from '@/pages/admin/experience/ExperienceList'
import ExperienceForm from '@/pages/admin/experience/ExperienceForm'
import SettingsPage from '@/pages/admin/settings/SettingsPage'
import NotFound from '@/pages/NotFound'

function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
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
              <AdminLogin />
            </PageTransition>
          }
        />

        {/* Admin CMS — everything under here is authenticated and uses AdminLayout instead of the public shell. */}
        <Route
          path={ROUTES.admin}
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminOverview />} />

          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/:id/edit" element={<ProjectForm />} />

          <Route path="certificates" element={<CertificateList />} />
          <Route path="certificates/new" element={<CertificateForm />} />
          <Route path="certificates/:id/edit" element={<CertificateForm />} />

          <Route path="achievements" element={<AchievementList />} />
          <Route path="achievements/new" element={<AchievementForm />} />
          <Route path="achievements/:id/edit" element={<AchievementForm />} />

          <Route path="journey" element={<JourneyList />} />
          <Route path="journey/new" element={<JourneyForm />} />
          <Route path="journey/:id/edit" element={<JourneyForm />} />

          <Route path="skills" element={<SkillList />} />
          <Route path="skills/new" element={<SkillForm />} />
          <Route path="skills/:id/edit" element={<SkillForm />} />

          <Route path="education" element={<EducationList />} />
          <Route path="education/new" element={<EducationForm />} />
          <Route path="education/:id/edit" element={<EducationForm />} />

          <Route path="experience" element={<ExperienceList />} />
          <Route path="experience/new" element={<ExperienceForm />} />
          <Route path="experience/:id/edit" element={<ExperienceForm />} />

          <Route path="settings" element={<SettingsPage />} />

          <Route path="*" element={<AdminNotFound />} />
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

export default function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <TooltipProvider>
      <div className="flex min-h-dvh flex-col">
        <ScrollToTop />
        {!isAdminRoute && <Navbar />}
        <main className="flex-1">
          <AppRoutes />
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </TooltipProvider>
  )
}
