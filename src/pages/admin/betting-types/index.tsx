import { useState } from 'react'
import AdminLayout from '../../../components/admin/Layout'
import BettingTypesForm from '../../../components/admin/BettingTypesForm'
import BettingTypesList from '../../../components/admin/BettingTypesList'

export default function BettingTypesPage() {
  const [selectedBettingType, setSelectedBettingType] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = (bettingType) => {
    setSelectedBettingType(bettingType)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BettingTypesList 
            onSelect={setSelectedBettingType} 
            selectedId={selectedBettingType?.id}
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
          {saveSuccess && (
            <div className="p-4 bg-green-50 text-green-800 rounded-lg">
              Betting type saved successfully!
            </div>
          )}
          <BettingTypesForm
            bettingType={selectedBettingType}
            onSave={handleSave}
          />
        </div>
      </div>
    </AdminLayout>
  )
}
