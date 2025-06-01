import { ReactNode } from 'react'
import AdminNav from './AdminNav'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="p-6 ml-64">
        {children}
      </div>
    </div>
  )
}
