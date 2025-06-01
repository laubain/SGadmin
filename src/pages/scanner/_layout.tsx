import { ReactNode } from 'react'
import DashboardLayout from '../../components/dashboard/Layout'

export default function ScannerLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
