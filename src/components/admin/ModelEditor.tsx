import { useState, useEffect } from 'react'
import FormBuilder from '../../analyze/FormBuilder'
import { FiSave, FiPlay, FiEye, FiEyeOff, FiStar } from 'react-icons/fi'

export default function ModelEditor({ model, onSave, onTest }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
    visibility: 'public',
    is_featured: false,
    input_schema: { fields: [] }
  })
  const [testInputs, setTestInputs] = useState({})

  useEffect(() => {
    if (model) {
      setFormData({
        name: model.name || '',
        description: model.description || '',
        prompt: model.prompt || '',
        visibility: model.visibility || 'public',
        is_featured: model.is_featured || false,
        input_schema: model.input_schema || { fields: [] }
      })
      
      // Initialize test inputs
      const initialTestInputs = {}
      model.input_schema?.fields?.forEach(field => {
        initialTestInputs[field.name] = ''
      })
      setTestInputs(initialTestInputs)
    }
  }, [model])

  const handleSave = () => {
    const modelData = {
      ...formData,
      id: model?.id,
      updated_at: new Date().toISOString()
    }
    onSave(modelData)
  }

  const handleTest = () => {
    onTest(testInputs)
  }

  const addInputField = () => {
    setFormData(prev => ({
      ...prev,
      input_schema: {
        fields: [
          ...prev.input_schema.fields,
          {
            name: `field_${Date.now()}`,
            type: 'text',
            label: 'New Field',
            required: false
          }
        ]
      }
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {model ? 'Edit Model' : 'Create New Model'}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md"
          >
            <FiSave className="mr-2" /> Save
          </button>
          {model && (
            <button
              onClick={handleTest}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md"
            >
              <FiPlay className="mr-2" /> Test
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded-md h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prompt Template</label>
            <textarea
              value={formData.prompt}
              onChange={(e) => setFormData({...formData, prompt: e.target.value})}
              className="w-full p-2 border rounded-md h-48 font-mono text-sm"
              placeholder="Enter your AI prompt template..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <button
                onClick={() => setFormData({...formData, visibility: formData.visibility === 'public' ? 'private' : 'public'})}
                className="flex items-center p-2 rounded-md bg-gray-100"
              >
                {formData.visibility === 'public' ? (
                  <FiEye className="text-green-600 mr-2" />
                ) : (
                  <FiEyeOff className="text-red-600 mr-2" />
                )}
                {formData.visibility === 'public' ? 'Public' : 'Private'}
              </button>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => setFormData({...formData, is_featured: !formData.is_featured})}
                className={`flex items-center p-2 rounded-md ${formData.is_featured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100'}`}
              >
                <FiStar className="mr-2" />
                Featured
              </button>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Input Fields</h3>
              <button
                onClick={addInputField}
                className="px-3 py-1 bg-gray-100 rounded-md text-sm"
              >
                Add Field
              </button>
            </div>

            <div className="space-y-4">
              {formData.input_schema.fields.map((field, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) => {
                        const newFields = [...formData.input_schema.fields]
                        newFields[index].name = e.target.value
                        setFormData({...formData, input_schema: { fields: newFields }})
                      }}
                      className="w-full p-2 border rounded-md text-sm"
                      placeholder="Field name"
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      value={field.type}
                      onChange={(e) => {
                        const newFields = [...formData.input_schema.fields]
                        newFields[index].type = e.target.value
                        setFormData({...formData, input_schema: { fields: newFields }})
                      }}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="select">Dropdown</option>
                    </select>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => {
                        const newFields = [...formData.input_schema.fields]
                        newFields[index].label = e.target.value
                        setFormData({...formData, input_schema: { fields: newFields }})
                      }}
                      className="w-full p-2 border rounded-md text-sm"
                      placeholder="Label"
                    />
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => {
                        const newFields = [...formData.input_schema.fields]
                        newFields[index].required = e.target.checked
                        setFormData({...formData, input_schema: { fields: newFields }})
                      }}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {model && formData.input_schema.fields.length > 0 && (
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-4">Test Inputs</h3>
              <FormBuilder
                schema={formData.input_schema}
                values={testInputs}
                onChange={setTestInputs}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
