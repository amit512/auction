import React, { useState, useEffect } from 'react'
import { auctionAPI } from '../services/api'

export const DebugPage: React.FC = () => {
  const [status, setStatus] = useState('Loading...')
  const [auctions, setAuctions] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('Testing API connection...')
        
        // Test basic fetch first
        const response = await fetch('http://localhost:5000/api/health')
        const healthData = await response.json()
        console.log('Health check:', healthData)
        
        if (healthData.status === 'OK') {
          setStatus('✅ Backend connected successfully!')
          
          // Now test auction API
          try {
            const auctionData = await auctionAPI.getAuctions({ limit: 5 })
            setAuctions(auctionData.data)
            setStatus('✅ Both backend and auction API working!')
          } catch (auctionError: any) {
            setError(`Auction API Error: ${auctionError.message}`)
            setStatus('❌ Auction API failed')
          }
        } else {
          setError('Backend health check failed')
          setStatus('❌ Backend not responding correctly')
        }
      } catch (err: any) {
        setError(`Connection Error: ${err.message}`)
        setStatus('❌ Cannot connect to backend')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Page</h1>
        
        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <p className="text-lg">{status}</p>
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="text-red-400">{error}</p>
            </div>
          )}
        </div>

        {auctions.length > 0 && (
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Sample Auctions ({auctions.length})</h2>
            <div className="space-y-4">
              {auctions.map((auction) => (
                <div key={auction._id} className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-semibold">{auction.title}</h3>
                  <p className="text-slate-300">${auction.currentBid} - {auction.category}</p>
                  <p className="text-sm text-slate-400">ID: {auction._id}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-white/5 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
          <div className="space-y-2 text-sm">
            <p>API URL: {import.meta.env.VITE_API_URL || 'Not set'}</p>
            <p>Current URL: {window.location.href}</p>
            <p>User Agent: {navigator.userAgent}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
