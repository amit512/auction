import React from 'react'
import { useBidHistory } from '../context/BidHistoryContext'
import { Link } from 'react-router-dom'
import { Gavel, Clock, DollarSign } from 'lucide-react'

export const BidHistoryPage: React.FC = () => {
  const { bidHistory, getTotalBids, getTotalBidAmount } = useBidHistory()

  if (bidHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <Gavel className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">No bids yet</h2>
        <p className="text-slate-400 mb-6">Start bidding on auctions to see your bid history!</p>
        <Link 
          to="/auctions" 
          className="inline-flex items-center rounded-md bg-primary/30 px-4 py-2 ring-1 ring-primary/40 hover:bg-primary/40"
        >
          Browse Auctions
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bid History</h1>
          <p className="text-slate-400">{getTotalBids()} total bids</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-primary">
            ${getTotalBidAmount().toLocaleString()}
          </div>
          <div className="text-sm text-slate-400">Total bid amount</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center gap-3">
            <Gavel className="h-8 w-8 text-primary" />
            <div>
              <div className="text-2xl font-semibold">{getTotalBids()}</div>
              <div className="text-sm text-slate-400">Total Bids</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-400" />
            <div>
              <div className="text-2xl font-semibold">${getTotalBidAmount().toLocaleString()}</div>
              <div className="text-sm text-slate-400">Total Amount</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-blue-400" />
            <div>
              <div className="text-2xl font-semibold">
                {new Set(bidHistory.map(bid => bid.auctionId)).size}
              </div>
              <div className="text-sm text-slate-400">Auctions Bid On</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Bids</h2>
        <div className="space-y-3">
          {bidHistory.map((bid) => (
            <div key={bid.id} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Link 
                    to={`/auctions/${bid.auctionId}`}
                    className="font-semibold hover:text-primary transition-colors"
                  >
                    {bid.auctionTitle}
                  </Link>
                  <div className="text-sm text-slate-400 mt-1">
                    Bid placed on {new Date(bid.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-primary">
                    ${bid.bidAmount.toLocaleString()}
                  </div>
                  {bid.isWinning && (
                    <div className="text-xs text-green-400 font-medium">Winning</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
