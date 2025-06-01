interface FormBuilderProps {
  schema: {
    fields: Array<{
      name: string
      type: string
      label: string
      required: boolean
      options?: string[]
    }>
  }
  values: Record<string, any>
  onChange: (values: Record<string, any>) => void
}

export function FormBuilder({ schema, values, onChange }: FormBuilderProps) {
  const handleChange = (fieldName: string, value: any) => {
    onChange({
      ...values,
      [fieldName]: value
    })
  }

  return (
    <div className="space-y-4">
      {schema.fields.map((field) => (
        <div key={field.name} className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500"> *</span>}
          </label>
          
          {field.type === 'select' ? (
            <select
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full p-2 border rounded-md"
              required={field.required}
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full p-2 border rounded-md"
              required={field.required}
            />
          )}
        </div>
      ))}
    </div>
  )
}
