import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../ui/Navbar'
import { Footer } from '../ui/Footer'

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100">
      <Navbar />
      <main className="container py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}


