import React, { useState } from 'react'

function JoinRequestPage({ group, currentUser, onSubmitRequest, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isFull = group.members.length >= group.maxMembers
  const isAlreadyMember = group.members.includes(currentUser.email)
  const expectedPending = group.pendingRequests?.some(r => r.email === currentUser.email)

  const handleSubmitRequest = async () => {
    setIsSubmitting(true)
    try {
      await onSubmitRequest()
      setIsSubmitting(false)
    } catch (error) {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-md">
        <div className="card-elevated p-8 sm:p-12">
          {/* Close Button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition-colors text-2xl leading-none"
          >
            ✕
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">
              Join {group.name}?
            </h1>
            <p className="text-slate-400">
              You've been invited to join a group expense sharing adventure
            </p>
          </div>

          {/* Group Info Card */}
          <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Group Leader</span>
              <span className="font-semibold text-slate-100">{group.creator}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Members</span>
              <span className="font-semibold">
                {group.members.length}/{group.maxMembers}
              </span>
            </div>
            {group.expenses && group.expenses.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Expenses</span>
                <span className="font-semibold text-slate-100">{group.expenses.length}</span>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {isAlreadyMember ? (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <p className="text-sm text-emerald-400">
                <strong>✓ You're already a member</strong> of this group. Go back to access it.
              </p>
            </div>
          ) : expectedPending ? (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-400">
                <strong>⏳ Request pending</strong> - Awaiting group leader approval.
              </p>
            </div>
          ) : isFull ? (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">
                <strong>✕ Group is full</strong> - This group has reached maximum capacity ({group.maxMembers} members).
              </p>
            </div>
          ) : null}

          {/* Members Preview */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Current Members</h3>
            <div className="space-y-2">
              {group.members.slice(0, 5).map((member, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                    {member.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate">{member}</span>
                  {member === group.creator && <span className="badge badge-primary text-xs">Leader</span>}
                </div>
              ))}
              {group.members.length > 5 && (
                <p className="text-sm text-slate-400">+{group.members.length - 5} more members</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isAlreadyMember && !isFull && !expectedPending && (
              <button
                onClick={handleSubmitRequest}
                disabled={isSubmitting}
                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '⏳ Sending...' : '✓ Request to Join'}
              </button>
            )}

            <button
              onClick={onCancel}
              className="btn-outline w-full py-3"
            >
              ← Go Back
            </button>
          </div>

          {/* Info Footer */}
          <div className="mt-6 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
            <p className="text-xs text-slate-400">
              <strong>💡 How it works:</strong> Once you request to join, the group leader will review and approve your request. You'll be notified when approved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JoinRequestPage
