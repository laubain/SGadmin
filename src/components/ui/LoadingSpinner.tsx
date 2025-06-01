import { FiLoader } from 'react-icons/fi'

export default function LoadingSpinner({ size = 5 }: { size?: number }) {
  return (
    <div className="flex justify-center items-center">
      <FiLoader className={`animate-spin h-${size} w-${size} text-blue-600`} />
    </div>
  )
}
