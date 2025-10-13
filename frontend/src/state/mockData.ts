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
  id: `${i + 1}`,
  title: `Premium Item #${i + 1}`,
  subtitle: 'Curated and authenticated item for discerning collectors',
  image: `${baseImg}&ixid=${i}`,
  currentBid: Math.floor(100 + Math.random() * 5000),
  bids: Math.floor(1 + Math.random() * 40),
  category: mockCategories[i % mockCategories.length],
  endsAt: new Date(Date.now() + (i + 1) * 36_00_000).toISOString(),
  seller: 'Seller Co.',
  description:
    'This is a mock description showcasing details, provenance, and specifications. Frontend-only demo.',
}))


