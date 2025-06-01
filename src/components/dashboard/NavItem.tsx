interface NavItemProps {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}

export default function NavItem({ children, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
        active ? 'bg-primary text-white' : 'hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}
