import React from 'react'
import { Link } from 'react-router-dom'

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-black/40 mt-12">
      <div className="container py-10 grid gap-6 md:grid-cols-3 text-sm text-slate-300">
        <div>
          <div className="font-semibold text-slate-100 mb-2">Auction House</div>
          <p className="text-slate-400">Modern auctions for unique finds. Frontend demo only.</p>
        </div>
        <div className="space-y-2">
          <div className="font-semibold text-slate-100">Explore</div>
          <div className="flex gap-4">
            <Link to="/auctions">Auctions</Link>
            <Link to="/create">Sell</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </div>
        <div className="space-y-2">
          <div className="font-semibold text-slate-100">Legal</div>
          <div className="flex gap-4">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-4 text-xs text-slate-400">© 2025 Auction House</div>
    </footer>
  )
}


