import type { ActivityView } from '../../state/ide-store'
import { useIdeStore } from '../../state/ide-store'

const items: { id: ActivityView; label: string; title: string }[] = [
  { id: 'explorer', label: '📁', title: 'Explorer' },
  { id: 'search', label: '🔎', title: 'Search (Coming Soon)' },
  { id: 'git', label: '⑂', title: 'Git' },
  { id: 'extensions', label: '🧩', title: 'Extensions (Coming Soon)' },
  { id: 'ai', label: '✦', title: 'AI Chat' },
  { id: 'settings', label: '⚙', title: 'Settings' }
]

export function ActivityBar(): JSX.Element {
  const activity = useIdeStore((s) => s.activity)
  const setActivity = useIdeStore((s) => s.setActivity)

  return (
    <nav className="activity">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          title={item.title}
          className={activity === item.id ? 'active' : ''}
          onClick={() => setActivity(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
