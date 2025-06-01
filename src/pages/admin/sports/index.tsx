import { useState } from 'react'
import AdminLayout from '../../../components/admin/Layout'
import SportsManagerForm from '../../../components/admin/SportsManagerForm'
import SportsManagerList from '../../../components/admin/SportsManagerList'

export default function SportsManagerPage() {
  const [selectedSport, setSelectedSport] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = (sport) => {
    setSelectedSport(sport)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SportsManagerList 
            onSelect={setSelectedSport} 
            selectedId={selectedSport?.id}
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
          {saveSuccess && (
            <div className="p-4 bg-green-50 text-green-800 rounded-lg">
              Sport saved successfully!
            </div>
          )}
          <SportsManagerForm
            sport={selectedSport}
            onSave={handleSave}
          />
        </div>
      </div>
    </AdminLayout>
  )
}
