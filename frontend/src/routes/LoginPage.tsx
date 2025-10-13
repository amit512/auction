import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { LoginCredentials } from '../state/types'

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const { login, error, clearError } = useAuth()
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
      await login(formData)
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
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-slate-400">Sign in to continue</p>
      </div>
      
      {error && (
        <div className="rounded-md bg-red-500/10 p-3 ring-1 ring-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="space-y-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10 focus:ring-2 focus:ring-primary/50 focus:outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10 focus:ring-2 focus:ring-primary/50 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-md bg-primary/30 ring-1 ring-primary/40 hover:bg-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
        <div className="mt-4 text-sm text-slate-400 text-center">
          No account? <Link to="/register" className="text-slate-200 underline hover:text-primary">Create one</Link>
        </div>
      </form>
    </div>
  )
}


