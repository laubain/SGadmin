import Link from 'next/link'
import { useRouter } from 'next/router'
import { 
  FiSettings, 
  FiUsers, 
  FiBarChart2, 
  FiBook, 
  FiCpu, 
  FiAward,
  FiDollarSign
} from 'react-icons/fi'

export default function AdminNav() {
  const router = useRouter()

  const navItems = [
    { path: '/admin/models', icon: <FiBook />, label: 'AI Models' },
    { path: '/admin/llm-providers', icon: <FiCpu />, label: 'LLM Providers' },
    { path: '/admin/sports', icon: <FiAward />, label: 'Sports' },
    { path: '/admin/betting-types', icon: <FiDollarSign />, label: 'Betting Types' },
    { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
    { path: '/admin/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
    { path: '/admin/settings', icon: <FiSettings />, label: 'Settings' }
  ]

  return (
    <nav className="fixed h-full w-64 bg-white shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
      </div>
      <div className="p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center p-3 rounded-md transition-colors ${
              router.pathname.startsWith(item.path)
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
