import React from 'react'
import { Link } from 'react-router-dom'
import { mockAuctions } from '../state/mockData'
import { AuctionCard } from '../ui/AuctionCard'

export const ProfilePage: React.FC = () => {
  const myAuctions = mockAuctions.slice(0, 3)
  const myBids = mockAuctions.slice(3, 9)

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10 flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold">Hi, Demo User</div>
          <div className="text-slate-400 text-sm">demo@auction.test</div>
        </div>
        <Link to="/create" className="rounded-md bg-primary/30 px-4 py-2 ring-1 ring-primary/40 hover:bg-primary/40 text-sm">Create auction</Link>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your auctions</h2>
          <Link to="/create" className="text-sm text-slate-300 underline">New</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myAuctions.map((a)=> <AuctionCard key={a.id} auction={a} />)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Your bids</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myBids.map((a)=> <AuctionCard key={a.id} auction={a} />)}
        </div>
      </section>
    </div>
  )
}


