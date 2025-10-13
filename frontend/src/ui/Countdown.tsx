import React, { useEffect, useState } from 'react'

function format(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const d = Math.floor(totalSeconds / 86400)
  const h = Math.floor((totalSeconds % 86400) / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m ${s}s`
  return `${m}m ${s}s`
}

export const Countdown: React.FC<{ endsAt: string }> = ({ endsAt }) => {
  const [now, setNow] = useState<number>(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const remaining = new Date(endsAt).getTime() - now
  return <span className={remaining <= 60_000 ? 'text-red-400' : ''}>{format(remaining)}</span>
}


