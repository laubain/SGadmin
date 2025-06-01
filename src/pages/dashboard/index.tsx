import { useState } from 'react'
import DashboardLayout from '../../components/dashboard/Layout'
import ModelCards from '../../components/dashboard/ModelCards'
import StreakTracker from '../../components/dashboard/StreakTracker'
import BetSlipScannerCTA from '../../components/dashboard/BetSlipScannerCTA'

export default function DashboardPage() {
  const [activeSport, setActiveSport] = useState('NFL')

  return (
    <DashboardLayout activeSport={activeSport} onSportChange={setActiveSport}>
      <div className="space-y-6">
        <StreakTracker />
        <ModelCards sport={activeSport} />
        <BetSlipScannerCTA />
      </div>
    </DashboardLayout>
  )
}
