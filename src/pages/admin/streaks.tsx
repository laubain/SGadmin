import AdminLayout from '../../components/admin/Layout'
import UserStreaks from '../../components/admin/UserStreaks'

export default function StreakAdminPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Streak Management</h1>
        <UserStreaks />
      </div>
    </AdminLayout>
  )
}
