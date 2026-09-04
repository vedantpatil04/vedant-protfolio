import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { TooltipProvider } from '@/components/ui/Tooltip'
import { Navbar } from '@/components/navigation'
import { Footer } from '@/components/layout'
import { ScrollToTop, PageTransition, RequireAuth } from '@/components/shared'
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
import AdminDashboard from '@/pages/admin/Dashboard'
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
        <Route
          path={ROUTES.admin}
          element={
            <PageTransition>
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            </PageTransition>
          }
        />
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
  return (
    <TooltipProvider>
      <div className="flex min-h-dvh flex-col">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  )
}
