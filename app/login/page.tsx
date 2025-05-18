'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/user/login', {
      method: 'POST',
      body: JSON.stringify(form),
    })
    if (res.ok) {
      router.push('/user')
    } else {
      const data = await res.json()
      setError(data.error || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded space-y-4">
      <h2 className="text-xl font-bold">Se connecter</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        name="password"
        type="password"
        placeholder="Mot de passe"
        value={form.password}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="cursor-pointer w-full bg-blue-500 text-white p-2 rounded">Se connecter</button>
      <p className="text-center mt-2 text-sm text-gray-600">
        Vous n&apos;avez pas encore de compte?{' '}
        <button
          type="button"
          onClick={() => router.push('/register')}
          className="cursor-pointer text-blue-600 hover:underline"
        >
          S&apos;inscrire
        </button>
      </p>
    </form>
  )
}
