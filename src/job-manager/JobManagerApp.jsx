import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { JobManagerProvider, useJobManager } from './context/JobManagerContext'
import ManagerLayout from './components/ManagerLayout'
import { LoadingState } from './components/UI'
import './manager.css'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const UpdatePasswordPage = lazy(() => import('./pages/UpdatePasswordPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const CalendarPage = lazy(() => import('./pages/CalendarPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ProjectFormPage = lazy(() => import('./pages/ProjectFormPage'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'))
const PaymentsPage = lazy(() => import('./pages/PaymentsPage'))
const FilesPage = lazy(() => import('./pages/FilesPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const LeadsPage = lazy(() => import('./pages/LeadsPage'))
const LeadDetailPage = lazy(() => import('./pages/LeadDetailPage'))

function ProtectedLayout() {
  const { data, user, authReady } = useJobManager(); const location = useLocation()
  if (!authReady) return <LoadingState />
  if (!user) return <Navigate to="/job-manager/login" state={{ from: location.pathname }} replace />
  if (!data) return <LoadingState />
  return <ManagerLayout />
}

function PermissionRoute({ permission, children }) {
  const { can } = useJobManager()
  return can(permission) ? children : <Navigate to="/job-manager" replace />
}

function ManagerRoutes() {
  return <Routes>
    <Route path="login" element={<LoginPage />} />
    <Route path="update-password" element={<UpdatePasswordPage />} />
    <Route element={<ProtectedLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="calendar" element={<CalendarPage />} />
      <Route path="leads" element={<LeadsPage />} />
      <Route path="leads/:id" element={<LeadDetailPage />} />
      <Route path="projects" element={<ProjectsPage />} />
      <Route path="projects/new" element={<PermissionRoute permission="create_projects"><ProjectFormPage /></PermissionRoute>} />
      <Route path="projects/:id" element={<ProjectDetailPage />} />
      <Route path="projects/:id/edit" element={<PermissionRoute permission="edit_projects"><ProjectFormPage /></PermissionRoute>} />
      <Route path="payments" element={<PermissionRoute permission="view_financials"><PaymentsPage /></PermissionRoute>} />
      <Route path="files" element={<FilesPage />} />
      <Route path="assistant" element={<Navigate to="/job-manager" replace />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/job-manager" replace />} />
  </Routes>
}

export default function JobManagerApp() { return <JobManagerProvider><Suspense fallback={<LoadingState />}><ManagerRoutes /></Suspense></JobManagerProvider> }
