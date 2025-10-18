import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { ReactNode } from 'react'
import { authAPI, setAuthToken, removeAuthToken, getStoredUser, setStoredUser } from '../services/api'
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
  isLoading: true,
  error: null
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing auth on mount - with better error handling
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const storedUser = getStoredUser()

        if (token && storedUser) {
          setAuthToken(token)
          try {
            // Verify token is still valid by fetching profile
            const user = await authAPI.getProfile()
            dispatch({ type: 'AUTH_SUCCESS', payload: user })
            setStoredUser(user)
          } catch (error) {
            console.warn('Token validation failed:', error)
            // Token is invalid, clear storage but don't show error
            removeAuthToken()
            dispatch({ type: 'AUTH_FAILURE', payload: '' })
          }
        } else {
          dispatch({ type: 'AUTH_FAILURE', payload: '' })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        // If anything goes wrong, just set as not authenticated
        dispatch({ type: 'AUTH_FAILURE', payload: '' })
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const { token, user } = await authAPI.login(credentials)
      
      setAuthToken(token)
      setStoredUser(user)
      dispatch({ type: 'AUTH_SUCCESS', payload: user })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const { token, user } = await authAPI.register(userData)
      
      setAuthToken(token)
      setStoredUser(user)
      dispatch({ type: 'AUTH_SUCCESS', payload: user })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const logout = () => {
    removeAuthToken()
    dispatch({ type: 'LOGOUT' })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const updateUser = async (userData: Partial<AuthUser>) => {
    try {
      const updatedUser = await authAPI.updateProfile(userData)
      setStoredUser(updatedUser)
      dispatch({ type: 'AUTH_SUCCESS', payload: updatedUser })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Update failed'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
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
