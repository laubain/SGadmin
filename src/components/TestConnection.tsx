import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function TestConnection() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...')
  const [tables, setTables] = useState<string[]>([])

  useEffect(() => {
    async function testConnection() {
      try {
        // Test auth connection
        const { data: { session }, error: authError } = await supabase.auth.getSession()
        
        if (authError) {
          setConnectionStatus(`Auth Error: ${authError.message}`)
          return
        }

        // Test database connection
        const { data: tablesData, error: dbError } = await supabase
          .from('pg_tables')
          .select('tablename')
          .eq('schemaname', 'public')
          .limit(5)

        if (dbError) {
          setConnectionStatus(`DB Error: ${dbError.message}`)
          return
        }

        setTables(tablesData.map(t => t.tablename))
        setConnectionStatus(`Connected successfully! Found ${tablesData.length} tables`)
      } catch (err) {
        setConnectionStatus(`Connection failed: ${err.message}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Supabase Connection Test</h2>
      <div className="space-y-2">
        <p>
          <span className="font-medium">Status:</span> {connectionStatus}
        </p>
        {tables.length > 0 && (
          <div>
            <p className="font-medium">Tables found:</p>
            <ul className="list-disc pl-5">
              {tables.map(table => (
                <li key={table}>{table}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
