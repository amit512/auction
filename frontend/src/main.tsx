import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { ThemeProvider } from './theme/ThemeProvider'
import { AuthProvider } from './context/AuthContext'
import { AuctionProvider } from './context/AuctionContext'
import { WishlistProvider } from './context/WishlistContext'
import { BidHistoryProvider } from './context/BidHistoryContext'
import { AppLayout } from './routes/AppLayout'
import { HomePage } from './routes/HomePage'
import { ListingsPage } from './routes/ListingsPage'
import { DetailsPage } from './routes/DetailsPage'
import { LoginPage } from './routes/LoginPage'
import { RegisterPage } from './routes/RegisterPage'
import { ProfilePage } from './routes/ProfilePage'
import { CreateAuctionPage } from './routes/CreateAuctionPage'
import { WishlistPage } from './routes/WishlistPage'
import { BidHistoryPage } from './routes/BidHistoryPage'

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-400">Something went wrong</h1>
            <p className="text-slate-300 mb-4">Error: {this.state.error?.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary/30 rounded-md ring-1 ring-primary/40 hover:bg-primary/40"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'auctions', element: <ListingsPage /> },
      { path: 'auctions/:id', element: <DetailsPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'bids', element: <BidHistoryPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'create', element: <CreateAuctionPage /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AuctionProvider>
            <WishlistProvider>
              <BidHistoryProvider>
                <RouterProvider router={router} />
              </BidHistoryProvider>
            </WishlistProvider>
          </AuctionProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
