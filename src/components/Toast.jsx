import React, { useState, useEffect } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), duration)
  }

  return { toast, showToast }
}

export function Toast({ toast }) {
  if (!toast) return null

  const bgColor = {
    success: 'bg-emerald-500/20 border-emerald-500/50',
    error: 'bg-red-500/20 border-red-500/50',
    info: 'bg-blue-500/20 border-blue-500/50',
    warning: 'bg-amber-500/20 border-amber-500/50'
  }[toast.type]

  const textColor = {
    success: 'text-emerald-400',
    error: 'text-red-400',
    info: 'text-blue-400',
    warning: 'text-amber-400'
  }[toast.type]

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  }

  return (
    <div className={`fixed top-4 right-4 max-w-sm p-4 rounded-lg border ${bgColor} backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-2`}>
      <div className="flex items-start gap-3">
        <span className={`text-xl flex-shrink-0 ${textColor}`}>
          {icons[toast.type]}
        </span>
        <p className="text-sm text-slate-200">{toast.message}</p>
      </div>
    </div>
  )
}
