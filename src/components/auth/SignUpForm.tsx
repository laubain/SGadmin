import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '../../lib/supabase'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export default function SignUpForm() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data) => {
    const { error } = await supabase.auth.signUp({
      ...data,
      options: {
        data: {
          trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    })
    if (error) alert(error.message)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          {...register('email')}
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          {...register('password')}
          type="password"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-primary py-2 px-4 text-white hover:bg-secondary"
      >
        Start 7-Day Trial
      </button>
    </form>
  )
}
