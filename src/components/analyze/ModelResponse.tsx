interface ModelResponseProps {
  response: {
    analysis: string
    confidence: number
    tags: string[]
    summary: string
  }
}

export function ModelResponse({ response }: ModelResponseProps) {
  const getEmojiForConfidence = (confidence: number) => {
    if (confidence > 80) return '🚀'
    if (confidence > 60) return '👍'
    if (confidence > 40) return '🤔'
    return '⚠️'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">AI Analysis</h2>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">
            {getEmojiForConfidence(response.confidence)}
          </span>
          <span className="text-sm text-gray-500">
            Confidence: {response.confidence}%
          </span>
        </div>
      </div>

      <div className="prose max-w-none">
        <p>{response.analysis}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {response.tags.map((tag) => (
          <span 
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-md">
        <h3 className="font-medium text-blue-800 mb-2">Summary</h3>
        <p className="text-blue-700">{response.summary}</p>
      </div>
    </div>
  )
}
