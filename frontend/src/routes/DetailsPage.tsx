import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { mockAuctions } from '../state/mockData'
import { Countdown } from '../ui/Countdown'
import { useBidHistory } from '../context/BidHistoryContext'

export const DetailsPage: React.FC = () => {
  const { id } = useParams()
  const item = useMemo(() => mockAuctions.find((a) => a.id === id), [id])
  const { addBid, getBidsForAuction } = useBidHistory()
  const [bidAmount, setBidAmount] = useState('')
  const [showBidHistory, setShowBidHistory] = useState(false)
  
  if (!item) return <div>Not found.</div>

  const userBids = getBidsForAuction(item.id)
  const minBid = item.currentBid + 10

  const handleBid = () => {
    const amount = parseInt(bidAmount)
    if (amount >= minBid) {
      addBid(item.id, item.title, amount)
      setBidAmount('')
      // In a real app, this would update the auction's current bid
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/5">
        <img src={item.image} alt={item.title} className="w-full object-cover" />
      </div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">{item.title}</h1>
          <p className="text-slate-300 mt-1">{item.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-3xl font-semibold">${item.currentBid.toLocaleString()}</div>
          <div className="text-slate-300">Current bid</div>
        </div>
        <div className="text-slate-300">Ends in <span className="text-slate-100"><Countdown endsAt={item.endsAt} /></span></div>
        <div className="space-y-2">
          <div className="font-medium">Place a bid</div>
          <div className="flex gap-2">
            <input 
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Min ${minBid}`} 
              className="h-11 flex-1 rounded-md bg-white/5 px-3 ring-1 ring-white/10" 
            />
            <button 
              onClick={handleBid}
              disabled={!bidAmount || parseInt(bidAmount) < minBid}
              className="h-11 rounded-md bg-primary/30 px-4 ring-1 ring-primary/40 hover:bg-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Bid
            </button>
          </div>
          <p className="text-xs text-slate-400">Bids are mock-only and will not be saved.</p>
          
          {userBids.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowBidHistory(!showBidHistory)}
                className="text-sm text-primary hover:underline"
              >
                {showBidHistory ? 'Hide' : 'Show'} your bids ({userBids.length})
              </button>
              
              {showBidHistory && (
                <div className="mt-2 space-y-2">
                  {userBids.map((bid) => (
                    <div key={bid.id} className="flex justify-between items-center text-sm bg-white/5 rounded-md p-2">
                      <span>${bid.bidAmount.toLocaleString()}</span>
                      <span className="text-slate-400">
                        {new Date(bid.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          <div className="font-medium mb-1">Description</div>
          <p className="text-slate-300">{item.description}</p>
        </div>
        <div className="text-sm text-slate-400">Seller: {item.seller} • Category: {item.category}</div>
      </div>
    </div>
  )
}


