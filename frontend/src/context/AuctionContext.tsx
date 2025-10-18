import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react'
import type { AuctionItem, Bid, CreateAuctionData, PaginatedResponse } from '../state/types'
import { auctionAPI } from '../services/api'
import { io as createSocket, Socket } from 'socket.io-client'

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
  connectToAuction: (auctionId: string) => void
  disconnectFromAuction: (auctionId: string) => void
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
  const socketRef = React.useRef<Socket | null>(null)

  useEffect(() => {
    // Lazy connect when needed; keep single socket instance
    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [])

  const fetchAuctions = async (params?: any) => {
    try {
      dispatch({ type: 'FETCH_START' })
      const { data, pagination } = await auctionAPI.getAuctions(params)
      dispatch({ type: 'FETCH_AUCTIONS_SUCCESS', payload: { auctions: data, pagination } })
    } catch (error: any) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to fetch auctions' })
      throw error
    }
  }

  const fetchAuctionById = async (id: string) => {
    try {
      dispatch({ type: 'FETCH_START' })
      const { auction, bids } = await auctionAPI.getAuctionById(id)
      dispatch({ type: 'FETCH_AUCTION_SUCCESS', payload: { auction, bids } })
    } catch (error: any) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to fetch auction' })
      throw error
    }
  }

  const createAuction = async (auctionData: CreateAuctionData) => {
    try {
      dispatch({ type: 'FETCH_START' })
      const item = await auctionAPI.createAuction(auctionData)
      dispatch({ type: 'CREATE_AUCTION_SUCCESS', payload: item })
    } catch (error: any) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to create auction' })
      throw error
    }
  }

  const updateAuction = async (id: string, auctionData: Partial<CreateAuctionData>) => {
    try {
      dispatch({ type: 'FETCH_START' })
      // Mock implementation
      dispatch({ type: 'FETCH_FAILURE', payload: 'Not implemented' })
    } catch (error: any) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to update auction' })
      throw error
    }
  }

  const deleteAuction = async (id: string) => {
    try {
      dispatch({ type: 'FETCH_START' })
      // Mock implementation
      dispatch({ type: 'FETCH_FAILURE', payload: 'Not implemented' })
    } catch (error: any) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to delete auction' })
      throw error
    }
  }

  const placeBid = async (auctionId: string, amount: number) => {
    try {
      dispatch({ type: 'FETCH_START' })
      const result = await auctionAPI.placeBid(auctionId, amount)
      dispatch({ type: 'PLACE_BID_SUCCESS', payload: result })
    } catch (error: any) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to place bid' })
      throw error
    }
  }

  const ensureSocket = () => {
    if (!socketRef.current) {
      socketRef.current = createSocket('/', { withCredentials: true })
      socketRef.current.on('connect_error', () => {})
      socketRef.current.on('disconnect', () => {})
      socketRef.current.on('auction:bid', (payload: { auctionId: string; currentBid: number; bids: number; bid: Bid }) => {
        if (state.currentAuction?._id === payload.auctionId) {
          dispatch({ type: 'PLACE_BID_SUCCESS', payload: { bid: payload.bid, auction: { currentBid: payload.currentBid, bids: payload.bids } } })
        }
      })
      socketRef.current.on('auction:status', (payload: { auctionId: string; status: AuctionItem['status']; winner?: string | null; finalBid?: number }) => {
        if (state.currentAuction?._id === payload.auctionId && state.currentAuction) {
          dispatch({ type: 'UPDATE_AUCTION_SUCCESS', payload: { ...state.currentAuction, status: payload.status, currentBid: payload.finalBid ?? state.currentAuction.currentBid, winner: payload.winner ?? state.currentAuction.winner } as AuctionItem })
        }
      })
    }
    return socketRef.current!
  }

  const connectToAuction = (auctionId: string) => {
    const s = ensureSocket()
    s.emit('join-auction', auctionId)
  }

  const disconnectFromAuction = (auctionId: string) => {
    socketRef.current?.emit('leave-auction', auctionId)
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
    clearCurrentAuction,
    connectToAuction,
    disconnectFromAuction
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
