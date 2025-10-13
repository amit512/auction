import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Clock, Gavel, Heart } from 'lucide-react'
import type { AuctionItem } from '../state/types'
import { Countdown } from './Countdown'
import { useWishlist } from '../context/WishlistContext'

export const AuctionCard: React.FC<{ auction: AuctionItem }> = ({ auction }) => {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const isWishlisted = isInWishlist(auction._id)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(auction._id)
  }

  // Helper function to get seller name
  const getSellerName = () => {
    if (typeof auction.seller === 'string') {
      return 'Unknown Seller'
    }
    return auction.seller.firstName ? `${auction.seller.firstName} ${auction.seller.lastName}` : auction.seller.username
  }

  return (
    <div className="group block rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition-colors relative">
      <Link to={`/auctions/${auction._id}`} className="block">
        <motion.div className="aspect-video overflow-hidden" initial={{ scale: 1 }} whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
          <img src={auction.image} alt={auction.title} className="h-full w-full object-cover" />
        </motion.div>
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold line-clamp-1">{auction.title}</h3>
            <span className="text-primary/80 text-sm">${auction.currentBid.toLocaleString()}</span>
          </div>
          <p className="text-sm text-slate-300 line-clamp-2">{auction.subtitle || auction.description}</p>
          <div className="flex items-center justify-between pt-2 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> <Countdown endsAt={auction.endsAt} /></span>
            <span className="inline-flex items-center gap-1"><Gavel className="h-4 w-4" /> {auction.bids} bids</span>
          </div>
          <div className="text-xs text-slate-400">
            by {getSellerName()}
          </div>
        </div>
      </Link>
      
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart 
          className={`h-5 w-5 transition-colors ${
            isWishlisted 
              ? 'fill-red-500 text-red-500' 
              : 'text-white hover:text-red-400'
          }`} 
        />
      </button>
    </div>
  )
}


