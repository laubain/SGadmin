import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/Home'
import LoginPage from './pages/auth/Login'
import SignUpPage from './pages/auth/SignUp'
import ProtectedRoute from './components/auth/ProtectedRoute'
import TestConnection from './components/TestConnection'
import DashboardPage from './pages/dashboard'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="test-connection" element={<TestConnection />} />
        <Route path="dashboard" element={<ProtectedRoute />}>
          <Route index element={<DashboardPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
