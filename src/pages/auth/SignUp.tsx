import SignUpForm from '../../components/auth/SignUpForm'

export default function SignUpPage() {
  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Start Your Free Trial</h2>
      <SignUpForm />
    </div>
  )
}
