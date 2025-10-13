import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, Sun, Moon, Hammer, Heart, Gavel, User, LogOut } from 'lucide-react'
import { useTheme } from '../theme/ThemeProvider'
import { useWishlist } from '../context/WishlistContext'
import { useBidHistory } from '../context/BidHistoryContext'
import { useAuth } from '../context/AuthContext'

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const { wishlist } = useWishlist()
  const { getTotalBids } = useBidHistory()
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b border-white/10 bg-black/30">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/20">
              <Hammer className="h-5 w-5 text-primary" />
            </span>
            Auction House
          </Link>
          <nav className="ml-6 hidden md:flex items-center gap-4 text-sm text-slate-300">
            <NavLink to="/" className={({isActive})=> isActive? 'text-white' : ''}>Home</NavLink>
            <NavLink to="/auctions" className={({isActive})=> isActive? 'text-white' : ''}>Auctions</NavLink>
            <NavLink to="/create" className={({isActive})=> isActive? 'text-white' : ''}>Sell</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              placeholder="Search items..."
              className="h-10 w-64 rounded-md bg-white/5 pl-9 pr-3 text-sm outline-none ring-1 ring-white/10 focus:ring-primary/50"
              onKeyDown={(e)=>{ if (e.key==='Enter') navigate('/auctions') }}
            />
          </div>
          
          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
            aria-label="View wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs font-medium text-white flex items-center justify-center">
                {wishlist.length > 99 ? '99+' : wishlist.length}
              </span>
            )}
          </Link>
          
          {/* Bid History Button */}
          <Link
            to="/bids"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
            aria-label="View bid history"
          >
            <Gavel className="h-5 w-5" />
            {getTotalBids() > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-500 text-xs font-medium text-white flex items-center justify-center">
                {getTotalBids() > 99 ? '99+' : getTotalBids()}
              </span>
            )}
          </Link>
          
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="hidden sm:inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10"
              >
                <User className="h-4 w-4" />
                {user?.firstName}
              </Link>
              <button
                onClick={logout}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center rounded-md bg-primary/20 px-3 py-2 text-sm ring-1 ring-primary/40 hover:bg-primary/30"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}


