import { useUser } from '../hooks/useUser'
import UserDropdown from './auth/UserDropdown'
import { Link } from 'react-router-dom'

export default function Header() {
  const { user } = useUser()

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Sports Genius</h1>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li><Link to="/" className="hover:text-accent">Home</Link></li>
            <li><Link to="/test-connection" className="hover:text-accent">Test Connection</Link></li>
            {user ? (
              <li><UserDropdown /></li>
            ) : (
              <>
                <li><Link to="/login" className="hover:text-accent">Login</Link></li>
                <li><Link to="/signup" className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary">Start Trial</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
