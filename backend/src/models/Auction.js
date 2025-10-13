import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  description: { type: String, required: true },
  image: { type: String, required: true },
  startingPrice: { type: Number, required: true },
  currentBid: { type: Number, default: 0 },
  bids: { type: Number, default: 0 },
  category: { type: String, required: true },
  endsAt: { type: Date, required: true },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'ended', 'cancelled'], 
    default: 'active' 
  },
  winner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  images: [{ type: String }], // Additional images
  condition: { 
    type: String, 
    enum: ['new', 'like-new', 'good', 'fair', 'poor'], 
    default: 'good' 
  },
  location: String,
  shippingCost: { type: Number, default: 0 },
  reservePrice: Number, // Minimum price to sell
}, { timestamps: true });

// Index for better query performance
auctionSchema.index({ category: 1, status: 1 });
auctionSchema.index({ endsAt: 1 });
auctionSchema.index({ seller: 1 });

export default mongoose.model("Auction", auctionSchema);
