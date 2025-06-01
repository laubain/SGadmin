import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import DashboardPage from '../pages/admin/Dashboard'

export default function Router() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
      </Route>
    </Routes>
  )
}
