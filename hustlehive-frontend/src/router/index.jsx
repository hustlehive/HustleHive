import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import GuestRoute from './GuestRoute'

import AuthLayout from '@/layouts/AuthLayout'
import RootLayout from '@/layouts/RootLayout'
import AdminLayout from '@/layouts/AdminLayout'

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
)

// Lazy-loaded public pages
const Landing = lazy(() => import('@/pages/Landing'))
const Login = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Register'))
const OtpVerification = lazy(() => import('@/pages/OtpVerification'))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'))
const VerifyForgotOtp = lazy(() => import('@/pages/VerifyForgotOtp'))
const ResetPassword = lazy(() => import('@/pages/ResetPassword'))

// Lazy-loaded app pages
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Search = lazy(() => import('@/pages/Search'))
const HustleDetails = lazy(() => import('@/pages/HustleDetails'))
const CreateHustle = lazy(() => import('@/pages/CreateHustle'))
const EditHustle = lazy(() => import('@/pages/EditHustle'))
const MyHustles = lazy(() => import('@/pages/MyHustles'))
const MyApplications = lazy(() => import('@/pages/MyApplications'))
const Friends = lazy(() => import('@/pages/Friends'))
const Inbox = lazy(() => import('@/pages/Inbox'))
const Notifications = lazy(() => import('@/pages/Notifications'))
const Profile = lazy(() => import('@/pages/Profile'))
const PublicProfile = lazy(() => import('@/pages/PublicProfile'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Lazy-loaded admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'))
const AdminHustles = lazy(() => import('@/pages/admin/AdminHustles'))
const AdminApplications = lazy(() => import('@/pages/admin/AdminApplications'))

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* ── Public landing ── */}
          <Route path="/" element={<Landing />} />

          {/* ── Guest-only routes (redirect to dashboard if logged in) ── */}
          <Route element={<GuestRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/verify" element={<OtpVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/forgot-password/verify" element={<VerifyForgotOtp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
          </Route>

          {/* ── Protected app routes ── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RootLayout />}>
              <Route path="/app/dashboard" element={<Dashboard />} />
              <Route path="/app/search" element={<Search />} />
              <Route path="/app/hustles/create" element={<CreateHustle />} />
              <Route path="/app/hustles/:id" element={<HustleDetails />} />
              <Route path="/app/hustles/:id/edit" element={<EditHustle />} />
              <Route path="/app/my-hustles" element={<MyHustles />} />
              <Route path="/app/my-applications" element={<MyApplications />} />
              <Route path="/app/friends" element={<Friends />} />
              <Route path="/app/inbox" element={<Inbox />} />
              <Route path="/app/inbox/:conversationId" element={<Inbox />} />
              <Route path="/app/notifications" element={<Notifications />} />
              <Route path="/app/profile" element={<Profile />} />
              <Route path="/app/users/:userId" element={<PublicProfile />} />
            </Route>
          </Route>

          {/* ── Admin routes ── */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/hustles" element={<AdminHustles />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
            </Route>
          </Route>

          {/* ── Redirect /app to dashboard ── */}
          <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default AppRouter