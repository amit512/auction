import React, { createContext, useContext, useEffect, useState } from 'react'
import type { AuctionItem } from '../state/types'

type WishlistContextValue = {
  wishlist: string[]
  addToWishlist: (auctionId: string) => void
  removeFromWishlist: (auctionId: string) => void
  toggleWishlist: (auctionId: string) => void
  isInWishlist: (auctionId: string) => boolean
  getWishlistItems: () => AuctionItem[]
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('auction-wishlist')
    if (stored) {
      try {
        setWishlist(JSON.parse(stored))
      } catch {
        setWishlist([])
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('auction-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (auctionId: string) => {
    setWishlist(prev => prev.includes(auctionId) ? prev : [...prev, auctionId])
  }

  const removeFromWishlist = (auctionId: string) => {
    setWishlist(prev => prev.filter(id => id !== auctionId))
  }

  const toggleWishlist = (auctionId: string) => {
    setWishlist(prev => 
      prev.includes(auctionId) 
        ? prev.filter(id => id !== auctionId)
        : [...prev, auctionId]
    )
  }

  const isInWishlist = (auctionId: string) => wishlist.includes(auctionId)

  const getWishlistItems = () => {
    // This will be used with mockAuctions to get full auction objects
    return []
  }

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistItems,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
