import React, { createContext, useContext, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { AuthUser, LoginCredentials, RegisterData } from '../state/types'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: AuthUser }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  clearError: () => void
  updateUser: (userData: Partial<AuthUser>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false, // Start as not loading
  error: null
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // No useEffect - no API calls on mount

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' })
      // Mock login for now
      const mockUser: AuthUser = {
        id: '1',
        username: credentials.email.split('@')[0],
        email: credentials.email,
        firstName: 'Test',
        lastName: 'User',
        rating: 5,
        isVerified: true
      }
      dispatch({ type: 'AUTH_SUCCESS', payload: mockUser })
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'Login failed' })
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' })
      // Mock register for now
      const mockUser: AuthUser = {
        id: '1',
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        rating: 5,
        isVerified: false
      }
      dispatch({ type: 'AUTH_SUCCESS', payload: mockUser })
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'Registration failed' })
      throw error
    }
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const updateUser = async (userData: Partial<AuthUser>) => {
    try {
      dispatch({ type: 'AUTH_START' })
      // Mock update for now
      if (state.user) {
        const updatedUser = { ...state.user, ...userData }
        dispatch({ type: 'AUTH_SUCCESS', payload: updatedUser })
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'Update failed' })
      throw error
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
