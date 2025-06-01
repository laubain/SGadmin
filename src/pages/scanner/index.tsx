import { useState, useCallback } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Camera, Upload, X, Check, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { v4 as uuidv4 } from 'uuid'

export default function BetSlipScanner() {
  const supabase = useSupabaseClient()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [streakCredit, setStreakCredit] = useState(0)
  const [error, setError] = useState('')

  const onDrop = useCallback((acceptedFiles) => {
    setError('')
    const acceptedFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (acceptedFiles.length > 0 && acceptedFileTypes.includes(acceptedFiles[0].type)) {
      setFile(acceptedFiles[0])
      setPreview(URL.createObjectURL(acceptedFiles[0]))
      setAnalysis(null)
    } else {
      setError('Please upload a valid image (JPEG, PNG)')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    },
    maxFiles: 1
  })

  const handleCameraClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // Implement camera capture logic here
      // For demo, we'll simulate file selection
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = 'image/*'
      fileInput.capture = 'environment'
      fileInput.onchange = (e) => {
        if (e.target.files.length > 0) {
          setFile(e.target.files[0])
          setPreview(URL.createObjectURL(e.target.files[0]))
          setAnalysis(null)
        }
      }
      fileInput.click()
    } catch (err) {
      setError('Camera access denied or not available')
    }
  }

  const uploadImage = async () => {
    if (!file) return

    setIsUploading(true)
    setError('')
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `bet-slips/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('bet-slips')
        .upload(filePath, file)

      if (uploadError) throw uploadError
      return filePath
    } catch (err) {
      setError('Failed to upload image')
      console.error(err)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const analyzeBetSlip = async () => {
    const filePath = await uploadImage()
    if (!filePath) return

    setIsAnalyzing(true)
    setError('')

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock analysis response
      const mockAnalysis = {
        bets: [
          { team: 'LA Lakers', line: '+5.5', odds: '-110', type: 'Spread' },
          { team: 'Golden State', line: 'Over 225.5', odds: '-110', type: 'Total' }
        ],
        analysis: "This 2-leg parlay has a 38% chance of hitting based on historical data. The Lakers have covered 60% of their last 10 games as underdogs.",
        confidence: 0.75,
        recommendedAction: "Consider removing the Warriors total as they've gone under in 7 of last 10 home games."
      }

      // Award streak credit
      const { data: creditData } = await supabase
        .from('user_streaks')
        .upsert({ credits: 1 }, { onConflict: 'user_id' })
        .select()

      setAnalysis(mockAnalysis)
      setStreakCredit(creditData?.[0]?.credits || 0)
    } catch (err) {
      setError('Failed to analyze bet slip')
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetScanner = () => {
    setFile(null)
    setPreview('')
    setAnalysis(null)
    setError('')
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Bet Slip Scanner</h1>
      
      {!file ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-lg font-medium">
            {isDragActive ? 'Drop the image here' : 'Drag & drop bet slip image'}
          </p>
          <p className="text-gray-500">or</p>
          <button
            type="button"
            onClick={handleCameraClick}
            className="mt-2 inline-flex items-center px-4 py-2 bg-primary text-white rounded-md"
          >
            <Camera className="mr-2 h-4 w-4" />
            Take Photo
          </button>
          <p className="mt-2 text-sm text-gray-500">
            Supports JPG, JPEG, PNG (max 5MB)
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={preview}
              alt="Bet slip preview"
              className="rounded-lg border w-full max-h-96 object-contain"
            />
            <button
              onClick={resetScanner}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!analysis ? (
            <button
              onClick={analyzeBetSlip}
              disabled={isUploading || isAnalyzing}
              className="w-full flex justify-center items-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isUploading || isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploading ? 'Uploading...' : 'Analyzing...'}
                </>
              ) : (
                'Analyze Bet Slip'
              )}
            </button>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium">Analysis Complete</span>
                  <span className="ml-auto bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    +1 Streak Credit
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold">Extracted Bets</h2>
                <div className="space-y-3">
                  {analysis.bets.map((bet, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <span className="font-medium">{bet.team}</span>
                        <span className="text-gray-500">{bet.type}</span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span>{bet.line}</span>
                        <span className="font-medium">{bet.odds}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold">AI Insights</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="whitespace-pre-line">{analysis.analysis}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold">Recommendation</h2>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p>{analysis.recommendedAction}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Confidence: {(analysis.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              <button
                onClick={resetScanner}
                className="w-full px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Scan Another Bet Slip
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}
    </div>
  )
}
