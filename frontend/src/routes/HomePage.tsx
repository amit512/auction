import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FeaturedGrid } from '../sections/FeaturedGrid'
import { CategoriesRail } from '../sections/CategoriesRail'
import { useAuction } from '../context/AuctionContext'
import { useAuth } from '../context/AuthContext'

export const HomePage: React.FC = () => {
  const { fetchAuctions } = useAuction()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Fetch featured auctions on component mount
    fetchAuctions({ limit: 8, status: 'active' }).catch(console.error)
  }, [fetchAuctions])

  return (
    <div className="space-y-10">
      <motion.section className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-sky-500/10 p-8" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Discover rare items and bid in real-time</h1>
          <p className="mt-3 text-slate-300">Join our live auction platform and discover unique items from around the world.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/auctions" className="rounded-md bg-primary/30 px-4 py-2 ring-1 ring-primary/40 hover:bg-primary/40">Browse auctions</Link>
            {isAuthenticated ? (
              <Link to="/create" className="rounded-md bg-white/5 px-4 py-2 ring-1 ring-white/10 hover:bg-white/10">Create auction</Link>
            ) : (
              <Link to="/register" className="rounded-md bg-white/5 px-4 py-2 ring-1 ring-white/10 hover:bg-white/10">Get started</Link>
            )}
          </div>
        </div>
        <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      </motion.section>

      <CategoriesRail />
      <FeaturedGrid />
    </div>
  )
}


