'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', lastName: '', address: '', phone: '', email: '', password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/user/register', {
      method: 'POST',
      body: JSON.stringify(form)
    })
    if (res.ok) {
      router.push('/user')
    } else {
      alert('Failed to register')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4 bg-white p-6 rounded shadow">
      <input
        name="name"
        type="text"
        placeholder="Prénom"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        name="lastName"
        type="text"
        placeholder="Nom"
        value={form.lastName}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        name="address"
        type="text"
        placeholder="Adresse"
        value={form.address}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        name="phone"
        type="text"
        placeholder="Téléphone"
        value={form.phone}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
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
      <button type="submit" className="cursor-pointer w-full bg-blue-500 text-white p-2 rounded">S'inscrire</button>
      <p className="text-center mt-2 text-sm text-gray-600">
        Vous avez déjà un compte?{' '}
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="cursor-pointer text-blue-600 hover:underline"
        >
          Se connecter
        </button>
      </p>
    </form>
  )
}
