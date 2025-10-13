import React, { createContext, useContext, useEffect, useState } from 'react'

export type BidHistoryItem = {
  id: string
  auctionId: string
  auctionTitle: string
  bidAmount: number
  timestamp: string
  isWinning: boolean
}

type BidHistoryContextValue = {
  bidHistory: BidHistoryItem[]
  addBid: (auctionId: string, auctionTitle: string, bidAmount: number) => void
  getBidsForAuction: (auctionId: string) => BidHistoryItem[]
  getTotalBids: () => number
  getTotalBidAmount: () => number
}

const BidHistoryContext = createContext<BidHistoryContextValue | undefined>(undefined)

export const BidHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bidHistory, setBidHistory] = useState<BidHistoryItem[]>([])

  // Load bid history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('auction-bid-history')
    if (stored) {
      try {
        setBidHistory(JSON.parse(stored))
      } catch {
        setBidHistory([])
      }
    }
  }, [])

  // Save bid history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('auction-bid-history', JSON.stringify(bidHistory))
  }, [bidHistory])

  const addBid = (auctionId: string, auctionTitle: string, bidAmount: number) => {
    const newBid: BidHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      auctionId,
      auctionTitle,
      bidAmount,
      timestamp: new Date().toISOString(),
      isWinning: false, // This would be determined by backend logic
    }

    setBidHistory(prev => [newBid, ...prev])
  }

  const getBidsForAuction = (auctionId: string) => {
    return bidHistory.filter(bid => bid.auctionId === auctionId)
  }

  const getTotalBids = () => {
    return bidHistory.length
  }

  const getTotalBidAmount = () => {
    return bidHistory.reduce((total, bid) => total + bid.bidAmount, 0)
  }

  const value = {
    bidHistory,
    addBid,
    getBidsForAuction,
    getTotalBids,
    getTotalBidAmount,
  }

  return <BidHistoryContext.Provider value={value}>{children}</BidHistoryContext.Provider>
}

export function useBidHistory() {
  const ctx = useContext(BidHistoryContext)
  if (!ctx) throw new Error('useBidHistory must be used within BidHistoryProvider')
  return ctx
}
