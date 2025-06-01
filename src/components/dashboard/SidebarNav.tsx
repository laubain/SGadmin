import { NavItem } from './NavItem'

const sports = [
  { id: 'NFL', name: 'NFL', icon: '🏈' },
  { id: 'NBA', name: 'NBA', icon: '🏀' },
  { id: 'MLB', name: 'MLB', icon: '⚾' },
  { id: 'NHL', name: 'NHL', icon: '🏒' },
  { id: 'SOCCER', name: 'Soccer', icon: '⚽' },
  { id: 'TENNIS', name: 'Tennis', icon: '🎾' }
]

interface SidebarNavProps {
  activeSport: string
  onSportChange: (sport: string) => void
}

export default function SidebarNav({ activeSport, onSportChange }: SidebarNavProps) {
  return (
    <nav className="fixed h-full w-64 bg-white shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Sports Genius</h2>
      </div>
      <div className="p-4 space-y-2">
        {sports.map((sport) => (
          <NavItem
            key={sport.id}
            active={activeSport === sport.id}
            onClick={() => onSportChange(sport.id)}
          >
            <span className="mr-2">{sport.icon}</span>
            {sport.name}
          </NavItem>
        ))}
      </div>
    </nav>
  )
}
