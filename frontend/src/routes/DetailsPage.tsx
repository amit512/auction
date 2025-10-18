import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Countdown } from '../ui/Countdown'
import { useBidHistory } from '../context/BidHistoryContext'
import { useAuction } from '../context/AuctionContext'

export const DetailsPage: React.FC = () => {
  const { id } = useParams()
  const { currentAuction, fetchAuctionById, placeBid, connectToAuction, disconnectFromAuction } = useAuction()
  const { addBid, getBidsForAuction } = useBidHistory()
  const [bidAmount, setBidAmount] = useState('')
  const [showBidHistory, setShowBidHistory] = useState(false)
  
  useEffect(() => {
    if (!id) return
    fetchAuctionById(id)
    connectToAuction(id)
    return () => disconnectFromAuction(id)
  }, [id])

  if (!currentAuction) return <div>Loading...</div>

  const userBids = getBidsForAuction(currentAuction._id)
  const minBid = currentAuction.currentBid + 1

  const handleBid = () => {
    const amount = parseInt(bidAmount)
    if (amount >= minBid) {
      addBid(currentAuction._id, currentAuction.title, amount)
      placeBid(currentAuction._id, amount).catch(() => {})
      setBidAmount('')
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
          <div className="text-3xl font-semibold">${currentAuction.currentBid.toLocaleString()}</div>
          <div className="text-slate-300">Current bid</div>
        </div>
        <div className="text-slate-300">
          {currentAuction.status === 'scheduled' ? (
            <>Starts in <span className="text-slate-100"><Countdown endsAt={currentAuction.startsAt!} /></span></>
          ) : (
            <>Ends in <span className="text-slate-100"><Countdown endsAt={currentAuction.endsAt} /></span></>
          )}
        </div>
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
          <p className="text-xs text-slate-400">Live bids update in real-time.</p>
          
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
          <p className="text-slate-300">{currentAuction.description}</p>
        </div>
        <div className="text-sm text-slate-400">Seller: {typeof currentAuction.seller === 'string' ? currentAuction.seller : currentAuction.seller.username} • Category: {currentAuction.category}</div>
      </div>
    </div>
  )
}


