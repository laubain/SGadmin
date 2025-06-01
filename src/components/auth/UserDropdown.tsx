import { supabase } from '../../lib/supabase'

export default function UserDropdown() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
          U
        </div>
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
        <div className="py-1">
          <a href="/account" className="block px-4 py-2 text-sm hover:bg-gray-100">
            Account
          </a>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
