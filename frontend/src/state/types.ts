export type User = {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  rating: number
  totalRatings: number
  isVerified: boolean
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export type AuctionItem = {
  _id: string
  title: string
  subtitle: string
  description: string
  image: string
  images?: string[]
  startingPrice: number
  currentBid: number
  bids: number
  category: string
  startsAt?: string
  endsAt: string
  seller: User | string
  status: 'active' | 'ended' | 'cancelled'
  winner?: User | string
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor'
  location?: string
  shippingCost: number
  reservePrice?: number
  createdAt: string
  updatedAt: string
}

export type Bid = {
  _id: string
  auction: string | AuctionItem
  bidder: User | string
  amount: number
  isWinning: boolean
  isOutbid: boolean
  bidTime: string
  autoBid?: {
    enabled: boolean
    maxAmount?: number
    increment: number
  }
  createdAt: string
  updatedAt: string
}

export type AuthUser = {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  rating: number
  isVerified: boolean
}

export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterData = {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

export type CreateAuctionData = {
  title: string
  subtitle?: string
  description: string
  image: string
  images?: string[]
  startingPrice: number
  category: string
  startsAt?: string
  endsAt: string
  condition?: 'new' | 'like-new' | 'good' | 'fair' | 'poor'
  location?: string
  shippingCost?: number
  reservePrice?: number
}

export type ApiResponse<T> = {
  data?: T
  error?: string
  message?: string
}

export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}


