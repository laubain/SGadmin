import { useState } from 'react'
import AdminLayout from '../../../components/admin/Layout'
import AIModelForm from '../../../components/admin/AIModelForm'
import AIModelList from '../../../components/admin/AIModelList'

export default function AIModelsPage() {
  const [selectedModel, setSelectedModel] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = (model) => {
    setSelectedModel(model)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AIModelList 
            onSelect={setSelectedModel} 
            selectedId={selectedModel?.id}
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
          {saveSuccess && (
            <div className="p-4 bg-green-50 text-green-800 rounded-lg">
              AI model saved successfully!
            </div>
          )}
          <AIModelForm
            model={selectedModel}
            onSave={handleSave}
          />
        </div>
      </div>
    </AdminLayout>
  )
}
