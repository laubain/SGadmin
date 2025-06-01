import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Table, Button, Input } from '../ui'

export default function UserStreaks() {
  const supabase = useSupabaseClient()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      let query = supabase
        .from('user_streaks')
        .select(`
          user_id,
          credits,
          last_activity,
          profiles:profiles (
            email,
            full_name
          )
        `)
        .order('credits', { ascending: false })

      if (search) {
        query = query.ilike('profiles.email', `%${search}%`)
      }

      const { data, error } = await query

      if (!error) {
        setUsers(data)
      }
      setLoading(false)
    }

    fetchUsers()
  }, [supabase, search])

  const resetStreak = async (userId) => {
    if (!confirm('Are you sure you want to reset this streak?')) return

    const { error } = await supabase
      .from('user_streaks')
      .update({ credits: 0, last_activity: new Date().toISOString() })
      .eq('user_id', userId)

    if (!error) {
      setUsers(users.map(user => 
        user.user_id === userId 
          ? { ...user, credits: 0, last_activity: new Date().toISOString() } 
          : user
      ))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">User Streaks</h2>
        <Input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>User</Table.Header>
            <Table.Header>Email</Table.Header>
            <Table.Header>Streak</Table.Header>
            <Table.Header>Last Activity</Table.Header>
            <Table.Header>Actions</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center py-4">
                Loading...
              </Table.Cell>
            </Table.Row>
          ) : users.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center py-4">
                No users found
              </Table.Cell>
            </Table.Row>
          ) : (
            users.map((user) => (
              <Table.Row key={user.user_id}>
                <Table.Cell>{user.profiles?.full_name || 'Anonymous'}</Table.Cell>
                <Table.Cell>{user.profiles?.email}</Table.Cell>
                <Table.Cell>
                  <span className="font-medium">{user.credits} days</span>
                </Table.Cell>
                <Table.Cell>
                  {new Date(user.last_activity).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => resetStreak(user.user_id)}
                  >
                    Reset
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </div>
  )
}
