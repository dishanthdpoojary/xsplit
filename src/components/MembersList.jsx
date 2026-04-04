import React from 'react'

function MembersList({ group, currentUser, onRemoveMember }) {
  const isLeader = group.creator === currentUser.email

  return (
    <div className="card-elevated">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Members</h3>
          <p className="text-sm text-slate-400 mt-1">
            {group.members.length}/{group.maxMembers} members
          </p>
        </div>
        <span className="text-3xl opacity-50">👥</span>
      </div>

      {/* Capacity Bar */}
      <div className="mb-6">
        <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              group.members.length >= group.maxMembers
                ? 'bg-amber-500'
                : 'bg-gradient-to-r from-primary to-secondary'
            }`}
            style={{ width: `${(group.members.length / group.maxMembers) * 100}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {group.maxMembers - group.members.length} slot{group.maxMembers - group.members.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Members List */}
      <div className="space-y-2">
        {group.members.map((member, idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-slate-600/50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                {member.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-100 truncate">
                  {member}
                  {member === currentUser.email && ' (You)'}
                </p>
                {member === group.creator && (
                  <span className="badge badge-primary text-xs mt-1">👑 Leader</span>
                )}
              </div>
            </div>

            {isLeader && member !== currentUser.email && (
              <button
                onClick={() => onRemoveMember(member)}
                className="btn-danger btn-sm ml-2 flex-shrink-0"
                title="Remove member"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {group.members.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <p>No members yet</p>
        </div>
      )}
    </div>
  )
}

export default MembersList
