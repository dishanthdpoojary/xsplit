import React from 'react'

function PendingRequestsList({ group, currentUser, onAccept, onReject }) {
  // Only show to group leader
  if (group.creator !== currentUser.email) {
    return null
  }

  if (!group.pendingRequests || group.pendingRequests.length === 0) {
    return null
  }

  const isFull = group.members.length >= group.maxMembers

  return (
    <div className="card-elevated border-l-4 border-l-amber-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Join Requests</h3>
          <p className="text-sm text-slate-400 mt-1">
            {group.pendingRequests.length} pending request{group.pendingRequests.length !== 1 ? 's' : ''}
          </p>
        </div>
        <span className={`text-3xl opacity-50 ${isFull ? 'text-amber-500' : ''}`}>
          {isFull ? '⚠️' : '✋'}
        </span>
      </div>

      {isFull && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-xs text-amber-400">
            <strong>Group is full</strong> (max {group.maxMembers} members). Accept a request by removing a member first.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {group.pendingRequests.map((request, idx) => (
          <div
            key={idx}
            className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-slate-600/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                    {request.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-100 truncate">{request.email}</p>
                    <p className="text-xs text-slate-500">
                      Requested {new Date(request.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => onAccept(request.email)}
                  disabled={isFull}
                  className="btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title={isFull ? 'Group is full' : 'Accept request'}
                >
                  ✓
                </button>
                <button
                  onClick={() => onReject(request.email)}
                  className="btn-danger btn-sm"
                  title="Reject request"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PendingRequestsList
