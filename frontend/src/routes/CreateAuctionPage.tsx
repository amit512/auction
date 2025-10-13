import React from 'react'

export const CreateAuctionPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Create an auction</h1>
        <p className="text-slate-400 text-sm">Fill the details to list your item</p>
      </div>

      <form className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Title</label>
            <input className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10" placeholder="Item title" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Category</label>
            <select className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10">
              <option>Art</option>
              <option>Collectibles</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home & Garden</option>
              <option>Sports</option>
              <option>Vehicles</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-300">Description</label>
          <textarea className="min-h-28 w-full rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10" placeholder="Describe your item" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Starting bid (USD)</label>
            <input className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10" placeholder="100" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300">End date</label>
            <input type="datetime-local" className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-300">Images</label>
          <input type="url" className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10" placeholder="Image URL" />
          <p className="text-xs text-slate-400">Use a public image URL (mock only)</p>
        </div>

        <div className="pt-2">
          <button type="button" className="h-11 rounded-md bg-primary/30 px-6 ring-1 ring-primary/40 hover:bg-primary/40">Preview</button>
        </div>
      </form>
    </div>
  )
}


