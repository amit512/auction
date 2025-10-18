import React, { createContext, useContext, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { AuctionItem, Bid, CreateAuctionData } from '../state/types'

interface AuctionState {
  auctions: AuctionItem[]
  currentAuction: AuctionItem | null
  bids: Bid[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  } | null
  isLoading: boolean
  error: string | null
}

type AuctionAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_AUCTIONS_SUCCESS'; payload: { auctions: AuctionItem[]; pagination: any } }
  | { type: 'FETCH_AUCTION_SUCCESS'; payload: { auction: AuctionItem; bids: Bid[] } }
  | { type: 'CREATE_AUCTION_SUCCESS'; payload: AuctionItem }
  | { type: 'UPDATE_AUCTION_SUCCESS'; payload: AuctionItem }
  | { type: 'DELETE_AUCTION_SUCCESS'; payload: string }
  | { type: 'PLACE_BID_SUCCESS'; payload: { bid: Bid; auction: { currentBid: number; bids: number } } }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'CLEAR_CURRENT_AUCTION' }

interface AuctionContextType extends AuctionState {
  fetchAuctions: (params?: any) => Promise<void>
  fetchAuctionById: (id: string) => Promise<void>
  createAuction: (auctionData: CreateAuctionData) => Promise<void>
  updateAuction: (id: string, auctionData: Partial<CreateAuctionData>) => Promise<void>
  deleteAuction: (id: string) => Promise<void>
  placeBid: (auctionId: string, amount: number) => Promise<void>
  clearError: () => void
  clearCurrentAuction: () => void
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined)

const auctionReducer = (state: AuctionState, action: AuctionAction): AuctionState => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      }
    case 'FETCH_AUCTIONS_SUCCESS':
      return {
        ...state,
        auctions: action.payload.auctions,
        pagination: action.payload.pagination,
        isLoading: false,
        error: null
      }
    case 'FETCH_AUCTION_SUCCESS':
      return {
        ...state,
        currentAuction: action.payload.auction,
        bids: action.payload.bids,
        isLoading: false,
        error: null
      }
    case 'CREATE_AUCTION_SUCCESS':
      return {
        ...state,
        auctions: [action.payload, ...state.auctions],
        isLoading: false,
        error: null
      }
    case 'UPDATE_AUCTION_SUCCESS':
      return {
        ...state,
        auctions: state.auctions.map(auction =>
          auction._id === action.payload._id ? action.payload : auction
        ),
        currentAuction: state.currentAuction?._id === action.payload._id ? action.payload : state.currentAuction,
        isLoading: false,
        error: null
      }
    case 'DELETE_AUCTION_SUCCESS':
      return {
        ...state,
        auctions: state.auctions.filter(auction => auction._id !== action.payload),
        currentAuction: state.currentAuction?._id === action.payload ? null : state.currentAuction,
        isLoading: false,
        error: null
      }
    case 'PLACE_BID_SUCCESS':
      return {
        ...state,
        bids: [action.payload.bid, ...state.bids],
        currentAuction: state.currentAuction ? {
          ...state.currentAuction,
          currentBid: action.payload.auction.currentBid,
          bids: action.payload.auction.bids
        } : null,
        auctions: state.auctions.map(auction =>
          auction._id === state.currentAuction?._id
            ? { ...auction, currentBid: action.payload.auction.currentBid, bids: action.payload.auction.bids }
            : auction
        ),
        isLoading: false,
        error: null
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    case 'CLEAR_CURRENT_AUCTION':
      return {
        ...state,
        currentAuction: null,
        bids: []
      }
    default:
      return state
  }
}

const initialState: AuctionState = {
  auctions: [],
  currentAuction: null,
  bids: [],
  pagination: null,
  isLoading: false,
  error: null
}

interface AuctionProviderProps {
  children: ReactNode
}

export const AuctionProvider: React.FC<AuctionProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(auctionReducer, initialState)

  const fetchAuctions = async (_params?: any) => {
    try {
      dispatch({ type: 'FETCH_START' })
      // Mock data for now
      const mockAuctions: AuctionItem[] = [
        {
          _id: '1',
          title: 'Test Auction 1',
          subtitle: 'Test subtitle',
          description: 'Test description',
          image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1000&auto=format&fit=crop',
          startingPrice: 100,
          currentBid: 150,
          bids: 5,
          category: 'Electronics',
          endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          seller: 'test-user',
          status: 'active',
          condition: 'good',
          shippingCost: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      dispatch({ type: 'FETCH_AUCTIONS_SUCCESS', payload: { auctions: mockAuctions, pagination: { currentPage: 1, totalPages: 1, totalItems: 1, itemsPerPage: 10 } } })
    } catch (error: any) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to fetch auctions' })
      throw error
    }
  }

  const fetchAuctionById = async (_id: string) => {
    try {
      dispatch({ type: 'FETCH_START' })
      // Mock implementation
      dispatch({ type: 'FETCH_FAILURE', payload: 'Not implemented' })
    } catch (error: any) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to fetch auction' })
      throw error
    }
  }

  const createAuction = async (_auctionData: CreateAuctionData) => {
    try {
      dispatch({ type: 'FETCH_START' })
      // Mock implementation
      dispatch({ type: 'FETCH_FAILURE', payload: 'Not implemented' })
    } catch (error: any) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to create auction' })
      throw error
    }
  }

  const updateAuction = async (_id: string, _auctionData: Partial<CreateAuctionData>) => {
    try {
      dispatch({ type: 'FETCH_START' })
      // Mock implementation
      dispatch({ type: 'FETCH_FAILURE', payload: 'Not implemented' })
    } catch (error: any) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to update auction' })
      throw error
    }
  }

  const deleteAuction = async (_id: string) => {
    try {
      dispatch({ type: 'FETCH_START' })
      // Mock implementation
      dispatch({ type: 'FETCH_FAILURE', payload: 'Not implemented' })
    } catch (error: any) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to delete auction' })
      throw error
    }
  }

  const placeBid = async (_auctionId: string, _amount: number) => {
    try {
      dispatch({ type: 'FETCH_START' })
      // Mock implementation
      dispatch({ type: 'FETCH_FAILURE', payload: 'Not implemented' })
    } catch (error: any) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to place bid' })
      throw error
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const clearCurrentAuction = () => {
    dispatch({ type: 'CLEAR_CURRENT_AUCTION' })
  }

  const value: AuctionContextType = {
    ...state,
    fetchAuctions,
    fetchAuctionById,
    createAuction,
    updateAuction,
    deleteAuction,
    placeBid,
    clearError,
    clearCurrentAuction
  }

  return (
    <AuctionContext.Provider value={value}>
      {children}
    </AuctionContext.Provider>
  )
}

export const useAuction = (): AuctionContextType => {
  const context = useContext(AuctionContext)
  if (context === undefined) {
    throw new Error('useAuction must be used within an AuctionProvider')
  }
  return context
}
