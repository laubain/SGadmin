import { ReactNode } from 'react'
import SidebarNav from './SidebarNav'

interface DashboardLayoutProps {
  children: ReactNode
  activeSport: string
  onSportChange: (sport: string) => void
}

export default function DashboardLayout({
  children,
  activeSport,
  onSportChange
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav activeSport={activeSport} onSportChange={onSportChange} />
      <div className="flex-1 p-6 ml-64">
        {children}
      </div>
    </div>
  )
}
