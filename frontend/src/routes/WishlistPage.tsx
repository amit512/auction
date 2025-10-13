import React from 'react'
import { useWishlist } from '../context/WishlistContext'
import { mockAuctions } from '../state/mockData'
import { AuctionCard } from '../ui/AuctionCard'
import { Heart } from 'lucide-react'

export const WishlistPage: React.FC = () => {
  const { wishlist } = useWishlist()
  
  // Get full auction objects for wishlisted items
  const wishlistItems = mockAuctions.filter(auction => wishlist.includes(auction.id))

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
        <p className="text-slate-400 mb-6">Start adding items you love to your wishlist!</p>
        <a 
          href="/auctions" 
          className="inline-flex items-center rounded-md bg-primary/30 px-4 py-2 ring-1 ring-primary/40 hover:bg-primary/40"
        >
          Browse Auctions
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Your Wishlist</h1>
          <p className="text-slate-400">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {wishlistItems.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  )
}
