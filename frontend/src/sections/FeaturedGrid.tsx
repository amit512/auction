import React from 'react'
import { AuctionCard } from '../ui/AuctionCard'
import { useAuction } from '../context/AuctionContext'

export const FeaturedGrid: React.FC = () => {
  const { auctions, isLoading, error } = useAuction()

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Featured auctions</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-white/5 rounded-lg mb-3"></div>
              <div className="h-4 bg-white/5 rounded mb-2"></div>
              <div className="h-3 bg-white/5 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Featured auctions</h2>
        <div className="rounded-lg bg-red-500/10 p-4 ring-1 ring-red-500/20">
          <p className="text-red-400">Failed to load auctions: {error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Featured auctions</h2>
      {auctions.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {auctions.slice(0, 6).map((auction) => (
            <AuctionCard key={auction._id} auction={auction} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-white/5 p-8 text-center">
          <p className="text-slate-400">No auctions available at the moment.</p>
        </div>
      )}
    </section>
  )
}


