import React, { useState } from 'react'
import CreateGroupForm from '../components/CreateGroupForm'
import InviteLinkCard from '../components/InviteLinkCard'

function GroupsScreen({ appState, currentUser, updateAppState, showToast, onOpenGroup }) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedGroupForInvite, setSelectedGroupForInvite] = useState(null)

  const handleGroupCreated = (newGroup) => {
    updateAppState({
      groups: [...appState.groups, newGroup]
    })
    showToast(`✓ Group "${newGroup.name}" created successfully!`, 'success')
    setShowCreateForm(false)
    // Show invite link immediately
    setSelectedGroupForInvite(newGroup.id)
  }

  const handleOpenGroup = (groupId) => {
    updateAppState({ currentGroupId: groupId })
    onOpenGroup()
  }

  const handleDeleteGroup = (groupId) => {
    if (confirm('Delete this group? This cannot be undone.')) {
      updateAppState({
        groups: appState.groups.filter(g => g.id !== groupId)
      })
      showToast('Group deleted.', 'success')
    }
  }

  const userGroups = appState.groups.filter(g => 
    g.members.includes(currentUser.email) || g.creator === currentUser.email
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8 space-y-8">
        {/* Section Header */}
        <div className="section-header">
          <h1 className="section-title">Group Expenses</h1>
          <p className="section-subtitle">Create groups and split expenses with friends and family</p>
        </div>

        {/* Create or Show Form */}
        {showCreateForm ? (
          <CreateGroupForm
            currentUser={currentUser}
            onGroupCreated={handleGroupCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full p-8 border-2 border-dashed border-slate-600 rounded-xl 
                       hover:border-primary hover:bg-primary/5 transition-all duration-200
                       text-center space-y-2 group"
          >
            <div className="text-4xl group-hover:scale-110 transition-transform">➕</div>
            <div className="font-bold text-slate-100">Create New Group</div>
            <div className="text-sm text-slate-400">Build a team and start splitting expenses</div>
          </button>
        )}

        {/* Show Invite Link for Newly Created Group */}
        {selectedGroupForInvite && (
          <InviteLinkCard
            group={appState.groups.find(g => g.id === selectedGroupForInvite)}
          />
        )}

        {/* Groups List */}
        <div>
          {userGroups.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <div className="empty-state-text">
                {showCreateForm ? 'Create your first group to get started!' : 'No groups yet. Create your first group!'}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 px-2 uppercase tracking-wider">
                {userGroups.length} Group{userGroups.length !== 1 ? 's' : ''}
              </h3>
              {userGroups.map(group => (
                <div
                  key={group.id}
                  className="group-card cursor-pointer"
                  onClick={() => handleOpenGroup(group.id)}
                >
                  {/* Header with delete button */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-2xl">👥</div>
                        <h3 className="text-xl font-bold text-slate-100 group-hover:text-primary transition-colors truncate">
                          {group.name}
                        </h3>
                        {group.creator === currentUser.email && (
                          <span className="badge badge-primary text-xs flex-shrink-0">👑 Leader</span>
                        )}
                      </div>
                      <div className="text-sm text-slate-500 ml-10">
                        Created by {group.creator === currentUser.email ? 'you' : group.creator}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteGroup(group.id)
                      }}
                      className="btn-danger btn-sm flex-shrink-0 ml-3"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="divider my-4" />

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                    <div className="stat-card bg-slate-800/50 border border-slate-700/50">
                      <div className="text-slate-400 text-xs font-medium mb-1">Members</div>
                      <div className="text-2xl font-bold text-primary">
                        {group.members.length}/{group.maxMembers || group.members.length}
                      </div>
                    </div>
                    <div className="stat-card bg-slate-800/50 border border-slate-700/50">
                      <div className="text-slate-400 text-xs font-medium mb-1">Expenses</div>
                      <div className="text-2xl font-bold text-secondary">{group.expenses?.length || 0}</div>
                    </div>
                    <div className="stat-card bg-slate-800/50 border border-slate-700/50">
                      <div className="text-slate-400 text-xs font-medium mb-1">Total</div>
                      <div className="text-2xl font-bold text-accent">
                        ₹{(group.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0).toFixed(0)}
                      </div>
                    </div>
                  </div>

                  {/* Pending Requests Badge */}
                  {group.pendingRequests && group.pendingRequests.length > 0 && group.creator === currentUser.email && (
                    <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="text-sm text-amber-400">
                        <strong>⏳ {group.pendingRequests.length} pending request{group.pendingRequests.length !== 1 ? 's' : ''}</strong>
                      </div>
                    </div>
                  )}

                  {/* Members Display */}
                  <div className="mb-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Members ({group.members.length})</div>
                    <div className="flex flex-wrap gap-2">
                      {group.members.map((member) => (
                        <span key={member} className="badge badge-primary text-xs">
                          {member === currentUser.email ? '(You)' : member.split('@')[0]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleOpenGroup(group.id)}
                      className="btn-primary flex-1"
                    >
                      → Open Group
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedGroupForInvite(selectedGroupForInvite === group.id ? null : group.id)
                      }}
                      className="btn-secondary flex-1"
                    >
                      🔗 Invite
                    </button>
                  </div>

                  {/* Show invite link if selected */}
                  {selectedGroupForInvite === group.id && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <div className="space-y-2">
                        <label className="form-label text-xs">Share Invite Link</label>
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 flex items-center justify-between gap-2">
                          <code className="text-xs text-primary truncate">
                            {window.location.origin}/join-group/{group.id}/{group.inviteToken}
                          </code>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigator.clipboard.writeText(`${window.location.origin}/join-group/${group.id}/${group.inviteToken}`)
                              showToast('✓ Invite link copied!', 'success')
                            }}
                            className="btn-secondary btn-sm flex-shrink-0 whitespace-nowrap"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GroupsScreen
