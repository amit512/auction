import React from 'react'

export const SimpleHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Auction House</h1>
        <p className="text-xl text-slate-300 mb-8">
          Welcome to our auction platform! This is a simple test page to verify the app is working.
        </p>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white/5 rounded-lg p-6 ring-1 ring-white/10">
              <div className="h-48 bg-white/10 rounded-lg mb-4"></div>
              <h3 className="font-semibold mb-2">Sample Auction {i}</h3>
              <p className="text-slate-300 mb-2">This is a test auction card</p>
              <p className="text-primary">$1,000</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="/debug" 
            className="inline-block bg-primary/30 px-6 py-3 rounded-lg ring-1 ring-primary/40 hover:bg-primary/40 transition-colors"
          >
            Go to Debug Page
          </a>
        </div>
      </div>
    </div>
  )
}
