import React, { useState } from 'react'

function InviteLinkCard({ group }) {
  const [copied, setCopied] = useState(false)

  const inviteLink = `/join-group/${group.id}/${group.inviteToken}`
  const fullUrl = `${window.location.origin}${inviteLink}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card-elevated border-l-4 border-l-secondary">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Invite Others</h3>
          <p className="text-sm text-slate-400 mt-1">Share this unique link to invite members</p>
        </div>
        <span className="text-3xl opacity-50">🔗</span>
      </div>

      <div className="mb-4">
        <label className="form-label text-xs">Invite Link</label>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 flex items-center justify-between gap-3 mt-2">
          <code className="text-xs text-primary truncate">{fullUrl}</code>
          <button
            onClick={handleCopyLink}
            className="btn-secondary btn-sm flex-shrink-0 whitespace-nowrap"
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
      </div>

      <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
        <p className="text-xs text-slate-400">
          <span className="font-semibold text-slate-300">💡 Tip:</span> Share this link on chat, email, or messaging apps. Users can click it to request to join your group.
        </p>
      </div>

      <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
        <div className="text-xs text-slate-300 space-y-1">
          <p><strong className="text-primary">Capacity:</strong> {group.members.length}/{group.maxMembers} members</p>
          {group.pendingRequests.length > 0 && (
            <p><strong className="text-secondary">{group.pendingRequests.length} pending</strong> request{group.pendingRequests.length !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default InviteLinkCard
