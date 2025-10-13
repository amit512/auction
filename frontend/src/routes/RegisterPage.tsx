import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { RegisterData } from '../state/types'

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const { register, error, clearError } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await register(formData)
      navigate('/')
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="text-slate-400">Join auctions and start bidding</p>
      </div>
      
      {error && (
        <div className="rounded-md bg-red-500/10 p-3 ring-1 ring-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="space-y-3">
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10 focus:ring-2 focus:ring-primary/50 focus:outline-none"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10 focus:ring-2 focus:ring-primary/50 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="firstName"
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10 focus:ring-2 focus:ring-primary/50 focus:outline-none"
            />
            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10 focus:ring-2 focus:ring-primary/50 focus:outline-none"
            />
          </div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10 focus:ring-2 focus:ring-primary/50 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-md bg-primary/30 ring-1 ring-primary/40 hover:bg-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
        <div className="mt-4 text-sm text-slate-400 text-center">
          Already have an account? <Link to="/login" className="text-slate-200 underline hover:text-primary">Sign in</Link>
        </div>
      </form>
    </div>
  )
}


