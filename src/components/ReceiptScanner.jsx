import React, { useState, useRef, useCallback } from 'react'
import { scanReceipt } from '../services/ocrService'

/**
 * ReceiptScanner
 * A drag-and-drop or click-to-upload receipt scanning component.
 *
 * Props:
 *  onScanComplete(result) — called with { merchant, total, items } on success
 *  onError(message)       — called with an error string on failure
 */
function ReceiptScanner({ onScanComplete, onError }) {
  const [state, setState] = useState('idle') // idle | dragging | scanning | done | error
  const [preview, setPreview] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef(null)

  const processFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPG, PNG, etc.)')
      setState('error')
      onError?.('Invalid file type.')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)

    setState('scanning')
    setErrorMsg('')

    const result = await scanReceipt(file)

    if (result.success) {
      setState('done')
      onScanComplete?.(result.data)
    } else {
      setState('error')
      setErrorMsg(result.error)
      onError?.(result.error)
    }
  }, [onScanComplete, onError])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    // reset so same file can be re-uploaded
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setState('idle')
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setState('dragging')
  }

  const handleDragLeave = () => {
    setState('idle')
  }

  const handleReset = () => {
    setState('idle')
    setPreview(null)
    setErrorMsg('')
  }

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        id="receipt-file-input"
        onChange={handleFileChange}
      />

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => state !== 'scanning' && inputRef.current?.click()}
        className={`
          relative rounded-2xl border-2 border-dashed cursor-pointer select-none
          transition-all duration-300 overflow-hidden min-h-[200px]
          flex flex-col items-center justify-center gap-4 p-8
          ${state === 'dragging'
            ? 'border-primary bg-primary/10 scale-[1.01]'
            : state === 'scanning'
            ? 'border-secondary/50 bg-secondary/5 cursor-wait'
            : state === 'done'
            ? 'border-green-500/50 bg-green-500/5'
            : state === 'error'
            ? 'border-red-500/50 bg-red-500/5'
            : 'border-slate-600 hover:border-primary/70 hover:bg-primary/5 bg-slate-800/30'
          }
        `}
      >
        {/* Preview image in background */}
        {preview && (
          <div className="absolute inset-0 opacity-10">
            <img src={preview} alt="receipt preview" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="relative z-10 text-center">
          {state === 'scanning' && (
            <>
              <div className="text-5xl mb-4 animate-pulse">🔍</div>
              <div className="font-bold text-slate-100 text-lg mb-1">Scanning Receipt...</div>
              <div className="text-slate-400 text-sm">Tesseract OCR is reading your image</div>
              <div className="mt-4 flex justify-center gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-secondary animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </>
          )}

          {state === 'done' && (
            <>
              <div className="text-5xl mb-4">✅</div>
              <div className="font-bold text-green-400 text-lg mb-1">Scan Complete!</div>
              <div className="text-slate-400 text-sm">Receipt data extracted successfully</div>
              <button
                onClick={(e) => { e.stopPropagation(); handleReset() }}
                className="mt-4 text-xs text-slate-500 hover:text-slate-300 underline transition-colors"
                type="button"
              >
                Scan another receipt
              </button>
            </>
          )}

          {state === 'error' && (
            <>
              <div className="text-5xl mb-4">❌</div>
              <div className="font-bold text-red-400 text-lg mb-1">Scan Failed</div>
              <div className="text-red-300/70 text-sm max-w-xs">{errorMsg}</div>
              <button
                onClick={(e) => { e.stopPropagation(); handleReset() }}
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-colors border border-red-500/20"
                type="button"
              >
                Try Again
              </button>
            </>
          )}

          {(state === 'idle' || state === 'dragging') && (
            <>
              <div className={`text-6xl mb-4 transition-transform duration-200 ${state === 'dragging' ? 'scale-110' : ''}`}>
                📸
              </div>
              <div className="font-semibold text-slate-100 text-lg mb-1">
                {state === 'dragging' ? 'Drop it here!' : 'Upload Receipt Image'}
              </div>
              <div className="text-slate-400 text-sm mb-3">
                Drag & drop or click to browse
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="px-2 py-1 bg-slate-700/50 rounded">JPG</span>
                <span className="px-2 py-1 bg-slate-700/50 rounded">PNG</span>
                <span className="px-2 py-1 bg-slate-700/50 rounded">WEBP</span>
              </div>
              <div className="mt-3 text-xs text-slate-600">
                📡 Powered by Tesseract OCR
              </div>
            </>
          )}
        </div>
      </div>

      {/* Server Status hint */}
      {state === 'idle' && (
        <p className="text-xs text-slate-600 text-center">
          Requires OCR server running at <code className="text-slate-500">localhost:3000</code>
        </p>
      )}
    </div>
  )
}

export default ReceiptScanner
