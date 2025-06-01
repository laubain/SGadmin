import LoginForm from '../../components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      <LoginForm />
    </div>
  )
}
