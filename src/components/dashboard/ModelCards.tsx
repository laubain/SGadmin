import { useState } from 'react'
import { ChevronDown, ChevronUp, Play } from 'lucide-react'

interface ModelCard {
  id: string
  title: string
  description: string
  inputs: {
    label: string
    type: string
    options?: string[]
  }[]
}

interface ModelCardsProps {
  sport: string
}

export default function ModelCards({ sport }: ModelCardsProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [inputValues, setInputValues] = useState<Record<string, string>>({})

  const models: Record<string, ModelCard[]> = {
    NFL: [
      {
        id: 'qb-performance',
        title: 'QB Performance Predictor',
        description: 'Predict QB passing yards, TDs, and INTs based on matchup',
        inputs: [
          { label: 'Opponent Defense Rank', type: 'number' },
          { label: 'Home/Away', type: 'select', options: ['Home', 'Away'] },
          { label: 'Weather', type: 'select', options: ['Clear', 'Rain', 'Snow', 'Windy'] }
        ]
      },
      {
        id: 'game-totals',
        title: 'Game Totals Model',
        description: 'Predict over/under for game totals',
        inputs: [
          { label: 'Team 1 Offense Rank', type: 'number' },
          { label: 'Team 2 Defense Rank', type: 'number' },
          { label: 'Vegas Line', type: 'number' }
        ]
      }
    ],
    NBA: [
      {
        id: 'player-props',
        title: 'Player Props Model',
        description: 'Predict player points, rebounds, assists',
        inputs: [
          { label: 'Minutes Projection', type: 'number' },
          { label: 'Opponent Defensive Rating', type: 'number' },
          { label: 'Home/Away', type: 'select', options: ['Home', 'Away'] }
        ]
      }
    ]
  }

  const handleInputChange = (modelId: string, inputLabel: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [`${modelId}-${inputLabel}`]: value
    }))
  }

  const handleRunModel = (modelId: string) => {
    console.log('Running model:', modelId, inputValues)
    // TODO: Connect to AI API
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{sport} AI Models</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(models[sport] || []).map((model) => (
          <div key={model.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{model.title}</h3>
              <button
                onClick={() => setExpandedCard(expandedCard === model.id ? null : model.id)}
                className="text-gray-500 hover:text-primary"
              >
                {expandedCard === model.id ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">{model.description}</p>
            
            {expandedCard === model.id && (
              <div className="mt-4 space-y-3">
                {model.inputs.map((input) => (
                  <div key={`${model.id}-${input.label}`}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {input.label}
                    </label>
                    {input.type === 'select' ? (
                      <select
                        className="w-full p-2 border rounded"
                        onChange={(e) => handleInputChange(model.id, input.label, e.target.value)}
                      >
                        {input.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={input.type}
                        className="w-full p-2 border rounded"
                        onChange={(e) => handleInputChange(model.id, input.label, e.target.value)}
                      />
                    )}
                  </div>
                ))}
                <button
                  onClick={() => handleRunModel(model.id)}
                  className="mt-2 flex items-center justify-center w-full bg-primary text-white py-2 px-4 rounded hover:bg-secondary"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run Model
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
