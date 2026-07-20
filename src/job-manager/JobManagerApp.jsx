import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { JobManagerProvider, useJobManager } from './context/JobManagerContext'
import ManagerLayout from './components/ManagerLayout'
import { LoadingState } from './components/UI'
import LoginPage from './pages/LoginPage'
import UpdatePasswordPage from './pages/UpdatePasswordPage'
import DashboardPage from './pages/DashboardPage'
import CalendarPage from './pages/CalendarPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectFormPage from './pages/ProjectFormPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import PaymentsPage from './pages/PaymentsPage'
import FilesPage from './pages/FilesPage'
import SettingsPage from './pages/SettingsPage'
import './manager.css'

function ProtectedLayout() {
  const { data, user, authReady } = useJobManager(); const location = useLocation()
  if (!authReady) return <LoadingState />
  if (!user) return <Navigate to="/job-manager/login" state={{ from: location.pathname }} replace />
  if (!data) return <LoadingState />
  return <ManagerLayout />
}

function ManagerRoutes() {
  return <Routes>
    <Route path="login" element={<LoginPage />} />
    <Route path="update-password" element={<UpdatePasswordPage />} />
    <Route element={<ProtectedLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="calendar" element={<CalendarPage />} />
      <Route path="projects" element={<ProjectsPage />} />
      <Route path="projects/new" element={<ProjectFormPage />} />
      <Route path="projects/:id" element={<ProjectDetailPage />} />
      <Route path="projects/:id/edit" element={<ProjectFormPage />} />
      <Route path="payments" element={<PaymentsPage />} />
      <Route path="files" element={<FilesPage />} />
      <Route path="assistant" element={<Navigate to="/job-manager" replace />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/job-manager" replace />} />
  </Routes>
}

export default function JobManagerApp() { return <JobManagerProvider><ManagerRoutes /></JobManagerProvider> }
