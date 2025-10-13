import express from "express";
import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";
import {
  validateAuctionCreation,
  validateBid,
  validateObjectId,
  validatePagination
} from "../middleware/validation.js";

const router = express.Router();

// Get all auctions with filtering and pagination
router.get("/", optionalAuth, validatePagination, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      status = 'active',
      search,
      sortBy = 'endsAt',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = { status };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;
    
    const auctions = await Auction.find(filter)
      .populate('seller', 'username firstName lastName avatar rating')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Auction.countDocuments(filter);

    res.json({
      auctions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get auction by ID
router.get("/:id", optionalAuth, validateObjectId('id'), async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('seller', 'username firstName lastName avatar rating')
      .populate('winner', 'username firstName lastName');

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    // Get bidding history
    const bids = await Bid.find({ auction: req.params.id })
      .populate('bidder', 'username firstName lastName avatar')
      .sort({ amount: -1, bidTime: -1 })
      .limit(20);

    res.json({ auction, bids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create auction
router.post("/", authenticateToken, validateAuctionCreation, async (req, res) => {
  try {
    const auctionData = {
      ...req.body,
      seller: req.user._id,
      currentBid: req.body.startingPrice
    };

    const auction = new Auction(auctionData);
    await auction.save();
    
    await auction.populate('seller', 'username firstName lastName avatar rating');
    res.status(201).json(auction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update auction
router.put("/:id", authenticateToken, validateObjectId('id'), async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    // Check if user is the seller
    if (auction.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this auction' });
    }

    // Don't allow updates if auction has ended or has bids
    if (auction.status !== 'active' || auction.bids > 0) {
      return res.status(400).json({ error: 'Cannot update auction that has ended or has bids' });
    }

    const allowedUpdates = ['title', 'subtitle', 'description', 'image', 'images', 'category', 'condition', 'location', 'shippingCost', 'reservePrice'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedAuction = await Auction.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('seller', 'username firstName lastName avatar rating');

    res.json(updatedAuction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete auction
router.delete("/:id", authenticateToken, validateObjectId('id'), async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    // Check if user is the seller or admin
    if (auction.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this auction' });
    }

    // Don't allow deletion if auction has bids
    if (auction.bids > 0) {
      return res.status(400).json({ error: 'Cannot delete auction that has bids' });
    }

    await Auction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Auction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Place a bid
router.post("/:id/bid", authenticateToken, validateObjectId('id'), validateBid, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    // Check if auction is active
    if (auction.status !== 'active') {
      return res.status(400).json({ error: 'Auction is not active' });
    }

    // Check if auction has ended
    if (new Date() >= new Date(auction.endsAt)) {
      return res.status(400).json({ error: 'Auction has ended' });
    }

    // Check if user is not the seller
    if (auction.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot bid on your own auction' });
    }

    const bidAmount = req.body.amount;

    // Check if bid is higher than current bid
    if (bidAmount <= auction.currentBid) {
      return res.status(400).json({ error: 'Bid must be higher than current bid' });
    }

    // Check if bid meets minimum increment (e.g., $1)
    const minIncrement = 1;
    if (bidAmount < auction.currentBid + minIncrement) {
      return res.status(400).json({ 
        error: `Bid must be at least $${auction.currentBid + minIncrement}` 
      });
    }

    // Create new bid
    const bid = new Bid({
      auction: req.params.id,
      bidder: req.user._id,
      amount: bidAmount
    });

    await bid.save();

    // Update auction
    auction.currentBid = bidAmount;
    auction.bids += 1;
    await auction.save();

    // Mark previous winning bid as outbid
    await Bid.updateMany(
      { 
        auction: req.params.id, 
        bidder: { $ne: req.user._id },
        isWinning: true 
      },
      { isOutbid: true, isWinning: false }
    );

    // Mark new bid as winning
    bid.isWinning = true;
    await bid.save();

    await bid.populate('bidder', 'username firstName lastName avatar');

    res.status(201).json({
      message: 'Bid placed successfully',
      bid,
      auction: {
        currentBid: auction.currentBid,
        bids: auction.bids
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's auctions
router.get("/user/:userId", validateObjectId('userId'), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { seller: req.params.userId };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    
    const auctions = await Auction.find(filter)
      .populate('seller', 'username firstName lastName avatar rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Auction.countDocuments(filter);

    res.json({
      auctions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
