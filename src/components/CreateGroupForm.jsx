import React, { useState } from 'react'
import { generateInviteToken } from '../utils/uuid'

function CreateGroupForm({ currentUser, onGroupCreated, onCancel }) {
  const [formData, setFormData] = useState({
    groupName: '',
    members: '',
    maxMembers: '2'
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.groupName.trim()) {
      newErrors.groupName = 'Group name is required'
    }

    const maxMembers = parseInt(formData.maxMembers)
    if (isNaN(maxMembers) || maxMembers < 2) {
      newErrors.maxMembers = 'Maximum members must be at least 2'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const members = formData.members
      .split(',')
      .map(m => m.trim())
      .filter(m => m)

    // Generate invite token
    const inviteToken = generateInviteToken()

    const newGroup = {
      id: Date.now(),
      name: formData.groupName,
      members: [currentUser.email],
      pendingRequests: members.map(email => ({ email, requestedAt: new Date().toISOString() })),
      leaderId: currentUser.uid,
      maxMembers: parseInt(formData.maxMembers),
      inviteToken: inviteToken,
      expenses: [],
      items: []
    }

    onGroupCreated(newGroup)
    setFormData({
      groupName: '',
      members: '',
      maxMembers: '2'
    })
  }

  return (
    <div className="card-elevated">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Create New Group</h2>
          <p className="text-sm text-slate-400 mt-1">Start splitting expenses with your team</p>
        </div>
        <span className="text-4xl opacity-50">🤝</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Group Name */}
        <div className="form-group">
          <label htmlFor="group-name" className="form-label">Group Name *</label>
          <input
            id="group-name"
            type="text"
            value={formData.groupName}
            onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
            placeholder="e.g., Trip to Goa, Shared Apartment"
            className={`form-input ${errors.groupName ? 'border-red-500' : ''}`}
            required
          />
          {errors.groupName && <p className="text-xs text-red-400 mt-1">{errors.groupName}</p>}
        </div>

        {/* Grid: Max Members and Members Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Max Members */}
          <div className="form-group">
            <label htmlFor="max-members" className="form-label">Maximum Members *</label>
            <div className="relative">
              <input
                id="max-members"
                type="number"
                value={formData.maxMembers}
                onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                placeholder="Minimum 2"
                min="2"
                max="99"
                className={`form-input ${errors.maxMembers ? 'border-red-500' : ''}`}
                required
              />
            </div>
            {errors.maxMembers && <p className="text-xs text-red-400 mt-1">{errors.maxMembers}</p>}
            <p className="text-xs text-slate-500 mt-1.5">You'll be member 1. Invite up to {Math.max(1, parseInt(formData.maxMembers) - 1)} more.</p>
          </div>

          {/* Members to Invite */}
          <div className="form-group">
            <label htmlFor="group-members" className="form-label">Invite Members</label>
            <input
              id="group-members"
              type="text"
              value={formData.members}
              onChange={(e) => setFormData({ ...formData, members: e.target.value })}
              placeholder="john@email.com, jane@email.com"
              className="form-input"
            />
            <p className="text-xs text-slate-500 mt-1.5">They'll receive a join request. Optional, can invite later.</p>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="text-sm text-slate-300">
            <p className="font-semibold text-slate-100 mb-2">Group Summary:</p>
            <div className="space-y-1 text-xs">
              <p>• <span className="text-primary">Leader:</span> {currentUser.name} ({currentUser.email})</p>
              <p>• <span className="text-secondary">Capacity:</span> {Math.max(1, parseInt(formData.maxMembers) - 1)} invitations available</p>
              {formData.members.trim() && (
                <p>• <span className="text-primary">Pending Invites:</span> {formData.members.split(',').filter(m => m.trim()).length}</p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="btn-primary flex-1 py-3"
          >
            ✓ Create Group
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-outline flex-1 py-3"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default CreateGroupForm
