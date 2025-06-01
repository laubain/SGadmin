import { useState } from 'react'
import AdminLayout from '../../../components/admin/Layout'
import LLMProviderForm from '../../../components/admin/LLMProviderForm'
import LLMProviderList from '../../../components/admin/LLMProviderList'

export default function LLMProvidersPage() {
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = (provider) => {
    setSelectedProvider(provider)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LLMProviderList 
            onSelect={setSelectedProvider} 
            selectedId={selectedProvider?.id}
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
          {saveSuccess && (
            <div className="p-4 bg-green-50 text-green-800 rounded-lg">
              LLM provider saved successfully!
            </div>
          )}
          <LLMProviderForm
            provider={selectedProvider}
            onSave={handleSave}
          />
        </div>
      </div>
    </AdminLayout>
  )
}
