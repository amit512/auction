import type { AuctionItem } from './types'

export const mockCategories = [
  'Art',
  'Collectibles',
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports',
  'Vehicles',
]

const baseImg = 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop'

export const mockAuctions: AuctionItem[] = Array.from({ length: 18 }).map((_, i) => ({
  _id: `${i + 1}`,
  title: `Premium Item #${i + 1}`,
  subtitle: 'Curated and authenticated item for discerning collectors',
  description:
    'This is a mock description showcasing details, provenance, and specifications. Frontend-only demo.',
  image: `${baseImg}&ixid=${i}`,
  images: [],
  startingPrice: 100,
  currentBid: Math.floor(100 + Math.random() * 5000),
  bids: Math.floor(1 + Math.random() * 40),
  category: mockCategories[i % mockCategories.length],
  endsAt: new Date(Date.now() + (i + 1) * 36_00_000).toISOString(),
  seller: {
    id: 'seller-1',
    username: 'seller',
    email: 'seller@example.com',
    firstName: 'Demo',
    lastName: 'Seller',
    rating: 5,
    totalRatings: 1,
    isVerified: true,
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  status: 'active',
  condition: 'good',
  shippingCost: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))


