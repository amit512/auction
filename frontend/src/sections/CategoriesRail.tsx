import React from 'react'
import { mockCategories } from '../state/mockData'
import { Link } from 'react-router-dom'

export const CategoriesRail: React.FC = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Browse by category</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {mockCategories.map((c) => (
          <Link
            key={c}
            to={`/auctions?category=${encodeURIComponent(c)}`}
            className="whitespace-nowrap rounded-full bg-white/5 px-4 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10"
          >
            {c}
          </Link>
        ))}
      </div>
    </section>
  )
}


