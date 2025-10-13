import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  auction: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Auction', 
    required: true 
  },
  bidder: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  isWinning: { 
    type: Boolean, 
    default: false 
  },
  isOutbid: { 
    type: Boolean, 
    default: false 
  },
  bidTime: { 
    type: Date, 
    default: Date.now 
  },
  autoBid: {
    enabled: { type: Boolean, default: false },
    maxAmount: Number,
    increment: { type: Number, default: 10 }
  }
}, { timestamps: true });

// Index for better query performance
bidSchema.index({ auction: 1, amount: -1 });
bidSchema.index({ bidder: 1 });
bidSchema.index({ bidTime: -1 });

// Compound index for finding winning bids
bidSchema.index({ auction: 1, isWinning: 1 });

export default mongoose.model("Bid", bidSchema);
