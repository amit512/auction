import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";

// Simple interval-based scheduler to activate and end auctions
export function initAuctionScheduler(io) {
  // Activate scheduled auctions whose start time has arrived
  setInterval(async () => {
    try {
      const now = new Date();
      const toActivate = await Auction.find({ status: 'scheduled', startsAt: { $lte: now } }).limit(50);
      if (toActivate.length === 0) return;
      for (const auction of toActivate) {
        auction.status = 'active';
        await auction.save();
        io.to(`auction:${auction._id}`).emit('auction:status', {
          auctionId: String(auction._id),
          status: 'active',
        });
      }
    } catch (err) {
      // swallow errors to avoid crashing scheduler
    }
  }, 5000);

  // End active auctions past their end time; determine winner if applicable
  setInterval(async () => {
    try {
      const now = new Date();
      const toEnd = await Auction.find({ status: 'active', endsAt: { $lte: now } }).limit(50);
      if (toEnd.length === 0) return;
      for (const auction of toEnd) {
        let winnerUserId = null;
        if (!auction.reservePrice || (auction.currentBid >= (auction.reservePrice || 0))) {
          const winningBid = await Bid.findOne({ auction: auction._id })
            .sort({ isWinning: -1, amount: -1, bidTime: -1 });
          winnerUserId = winningBid?.bidder || null;
        }
        auction.status = 'ended';
        auction.winner = winnerUserId;
        await auction.save();
        io.to(`auction:${auction._id}`).emit('auction:status', {
          auctionId: String(auction._id),
          status: 'ended',
          winner: winnerUserId ? String(winnerUserId) : null,
          finalBid: auction.currentBid,
        });
      }
    } catch (err) {
      // swallow errors
    }
  }, 7000);
}
