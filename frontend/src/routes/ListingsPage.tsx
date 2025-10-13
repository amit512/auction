import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { mockAuctions, mockCategories } from '../state/mockData'
import { AuctionCard } from '../ui/AuctionCard'
import { Filter, X } from 'lucide-react'

export const ListingsPage: React.FC = () => {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(params.get('category') || 'All')
  const [sort, setSort] = useState('Ending Soon')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [bidCount, setBidCount] = useState('')
  const [timeRemaining, setTimeRemaining] = useState('')

  const filtered = useMemo(() => {
    let list = mockAuctions
    
    // Text search
    if (query) {
      list = list.filter((a) => 
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase())
      )
    }
    
    // Category filter
    if (category !== 'All') {
      list = list.filter((a) => a.category === category)
    }
    
    // Price range filter
    if (priceRange.min) {
      list = list.filter((a) => a.currentBid >= parseInt(priceRange.min))
    }
    if (priceRange.max) {
      list = list.filter((a) => a.currentBid <= parseInt(priceRange.max))
    }
    
    // Bid count filter
    if (bidCount) {
      const count = parseInt(bidCount)
      if (count > 0) {
        list = list.filter((a) => a.bids >= count)
      }
    }
    
    // Time remaining filter
    if (timeRemaining) {
      const now = Date.now()
      const hours = parseInt(timeRemaining)
      const cutoffTime = now + (hours * 60 * 60 * 1000)
      list = list.filter((a) => new Date(a.endsAt).getTime() <= cutoffTime)
    }
    
    // Sorting
    if (sort === 'Ending Soon') {
      list = [...list].sort((a, b) => +new Date(a.endsAt) - +new Date(b.endsAt))
    } else if (sort === 'Highest Bid') {
      list = [...list].sort((a, b) => b.currentBid - a.currentBid)
    } else if (sort === 'Lowest Bid') {
      list = [...list].sort((a, b) => a.currentBid - b.currentBid)
    } else if (sort === 'Most Bids') {
      list = [...list].sort((a, b) => b.bids - a.bids)
    } else if (sort === 'Newest') {
      list = [...list].sort((a, b) => +new Date(b.endsAt) - +new Date(a.endsAt))
    }
    
    return list
  }, [category, query, sort, priceRange, bidCount, timeRemaining])

  const clearFilters = () => {
    setQuery('')
    setCategory('All')
    setPriceRange({ min: '', max: '' })
    setBidCount('')
    setTimeRemaining('')
    params.delete('category')
    setParams(params, { replace: true })
  }

  const hasActiveFilters = query || category !== 'All' || priceRange.min || priceRange.max || bidCount || timeRemaining

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-2xl font-semibold">Active Auctions</div>
          <div className="text-sm text-slate-400">{filtered.length} auction{filtered.length !== 1 ? 's' : ''} found</div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md ring-1 transition-colors ${
              showFilters 
                ? 'bg-primary/20 ring-primary/40 text-primary' 
                : 'bg-white/5 ring-white/10 hover:bg-white/10'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 ring-1 ring-white/10 hover:bg-white/10 text-sm"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search items, descriptions..."
          className="h-10 flex-1 rounded-md bg-white/5 px-3 text-sm ring-1 ring-white/10 focus:ring-primary/50"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-10 rounded-md bg-white/5 px-3 text-sm ring-1 ring-white/10"
        >
          <option>Ending Soon</option>
          <option>Highest Bid</option>
          <option>Lowest Bid</option>
          <option>Most Bids</option>
          <option>Newest</option>
        </select>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                  const v = e.target.value
                  if (v === 'All') {
                    params.delete('category')
                  } else {
                    params.set('category', v)
                  }
                  setParams(params, { replace: true })
                }}
                className="h-10 w-full rounded-md bg-white/5 px-3 text-sm ring-1 ring-white/10"
              >
                <option>All</option>
                {mockCategories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  placeholder="Min"
                  className="h-10 flex-1 rounded-md bg-white/5 px-3 text-sm ring-1 ring-white/10"
                />
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  placeholder="Max"
                  className="h-10 flex-1 rounded-md bg-white/5 px-3 text-sm ring-1 ring-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Minimum Bids</label>
              <input
                type="number"
                value={bidCount}
                onChange={(e) => setBidCount(e.target.value)}
                placeholder="Any"
                className="h-10 w-full rounded-md bg-white/5 px-3 text-sm ring-1 ring-white/10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Ending Within</label>
              <select
                value={timeRemaining}
                onChange={(e) => setTimeRemaining(e.target.value)}
                className="h-10 w-full rounded-md bg-white/5 px-3 text-sm ring-1 ring-white/10"
              >
                <option value="">Any time</option>
                <option value="1">1 hour</option>
                <option value="6">6 hours</option>
                <option value="24">24 hours</option>
                <option value="72">3 days</option>
                <option value="168">1 week</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <AuctionCard key={a.id} auction={a} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-xl font-semibold mb-2">No auctions found</div>
          <p className="text-slate-400 mb-4">Try adjusting your search criteria</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="rounded-md bg-primary/30 px-4 py-2 ring-1 ring-primary/40 hover:bg-primary/40"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}


