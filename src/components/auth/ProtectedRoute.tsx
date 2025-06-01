import { Navigate } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'

export default function ProtectedRoute({ children }) {
  const { user } = useUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
