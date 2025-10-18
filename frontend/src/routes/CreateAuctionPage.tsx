import React, { useState } from 'react'
import { useAuction } from '../context/AuctionContext'
import { useNavigate } from 'react-router-dom'

export const CreateAuctionPage: React.FC = () => {
  const { createAuction } = useAuction()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    category: 'Art',
    description: '',
    startingPrice: '',
    image: '',
    endsAt: '',
    startsAt: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Create an auction</h1>
        <p className="text-slate-400 text-sm">Fill the details to list your item</p>
      </div>

      <form className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10 space-y-4" onSubmit={async (e)=>{
        e.preventDefault()
        setIsSubmitting(true)
        try {
          await createAuction({
            title: form.title,
            category: form.category,
            description: form.description,
            startingPrice: parseFloat(form.startingPrice),
            image: form.image,
            endsAt: new Date(form.endsAt).toISOString(),
            ...(form.startsAt ? { startsAt: new Date(form.startsAt).toISOString() as any } : {}),
          } as any)
          navigate('/auctions')
        } finally {
          setIsSubmitting(false)
        }
      }}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Title</label>
            <input value={form.title} onChange={(e)=>setForm(f=>({...f,title:e.target.value}))} className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10" placeholder="Item title" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Category</label>
            <select value={form.category} onChange={(e)=>setForm(f=>({...f,category:e.target.value}))} className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10">
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
          <textarea value={form.description} onChange={(e)=>setForm(f=>({...f,description:e.target.value}))} className="min-h-28 w-full rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10" placeholder="Describe your item" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Starting bid (USD)</label>
            <input type="number" value={form.startingPrice} onChange={(e)=>setForm(f=>({...f,startingPrice:e.target.value}))} className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10" placeholder="100" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300">End date</label>
            <input type="datetime-local" value={form.endsAt} onChange={(e)=>setForm(f=>({...f,endsAt:e.target.value}))} className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-300">Start date (optional)</label>
          <input type="datetime-local" value={form.startsAt} onChange={(e)=>setForm(f=>({...f,startsAt:e.target.value}))} className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10" />
          <p className="text-xs text-slate-400">If set in the future, auction will start as scheduled.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-300">Images</label>
          <input type="url" value={form.image} onChange={(e)=>setForm(f=>({...f,image:e.target.value}))} className="h-11 w-full rounded-md bg-white/5 px-3 ring-1 ring-white/10" placeholder="Image URL" />
          <p className="text-xs text-slate-400">Use a public image URL (mock only)</p>
        </div>

        <div className="pt-2">
          <button disabled={isSubmitting} type="submit" className="h-11 rounded-md bg-primary/30 px-6 ring-1 ring-primary/40 hover:bg-primary/40 disabled:opacity-50">{isSubmitting? 'Creating...' : 'Create'}</button>
        </div>
      </form>
    </div>
  )
}


