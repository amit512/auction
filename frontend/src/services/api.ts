import axios, { AxiosResponse } from 'axios'
import type { 
  AuctionItem, 
  User, 
  Bid, 
  AuthUser, 
  LoginCredentials, 
  RegisterData, 
  CreateAuctionData,
  ApiResponse,
  PaginatedResponse
} from '../state/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<{ token: string; user: AuthUser }> => {
    const response: AxiosResponse<{ token: string; user: AuthUser }> = await api.post('/users/login', credentials)
    return response.data
  },

  register: async (userData: RegisterData): Promise<{ token: string; user: AuthUser }> => {
    const response: AxiosResponse<{ token: string; user: AuthUser }> = await api.post('/users/register', userData)
    return response.data
  },

  getProfile: async (): Promise<AuthUser> => {
    const response: AxiosResponse<AuthUser> = await api.get('/users/profile/me')
    return response.data
  },

  updateProfile: async (userData: Partial<AuthUser>): Promise<AuthUser> => {
    const response: AxiosResponse<{ user: AuthUser }> = await api.put('/users/profile/me', userData)
    return response.data.user
  },

  getUserById: async (userId: string): Promise<User> => {
    const response: AxiosResponse<User> = await api.get(`/users/${userId}`)
    return response.data
  }
}

// Auction API
export const auctionAPI = {
  getAuctions: async (params?: {
    page?: number
    limit?: number
    category?: string
    status?: string
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<AuctionItem>> => {
    const response: AxiosResponse<{ auctions: AuctionItem[]; pagination: any }> = await api.get('/auctions', { params })
    return {
      data: response.data.auctions,
      pagination: response.data.pagination
    }
  },

  getAuctionById: async (auctionId: string): Promise<{ auction: AuctionItem; bids: Bid[] }> => {
    const response: AxiosResponse<{ auction: AuctionItem; bids: Bid[] }> = await api.get(`/auctions/${auctionId}`)
    return response.data
  },

  createAuction: async (auctionData: CreateAuctionData): Promise<AuctionItem> => {
    const response: AxiosResponse<AuctionItem> = await api.post('/auctions', auctionData)
    return response.data
  },

  updateAuction: async (auctionId: string, auctionData: Partial<CreateAuctionData>): Promise<AuctionItem> => {
    const response: AxiosResponse<AuctionItem> = await api.put(`/auctions/${auctionId}`, auctionData)
    return response.data
  },

  deleteAuction: async (auctionId: string): Promise<void> => {
    await api.delete(`/auctions/${auctionId}`)
  },

  getUserAuctions: async (userId: string, params?: {
    status?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<AuctionItem>> => {
    const response: AxiosResponse<{ auctions: AuctionItem[]; pagination: any }> = await api.get(`/auctions/user/${userId}`, { params })
    return {
      data: response.data.auctions,
      pagination: response.data.pagination
    }
  },

  placeBid: async (auctionId: string, amount: number): Promise<{ bid: Bid; auction: { currentBid: number; bids: number } }> => {
    const response: AxiosResponse<{ bid: Bid; auction: { currentBid: number; bids: number } }> = await api.post(`/auctions/${auctionId}/bid`, { amount })
    return response.data
  }
}

// Utility functions
export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token)
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const removeAuthToken = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  delete api.defaults.headers.common['Authorization']
}

export const getStoredUser = (): AuthUser | null => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

export const setStoredUser = (user: AuthUser) => {
  localStorage.setItem('user', JSON.stringify(user))
}

export default api
