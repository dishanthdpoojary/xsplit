// Generate a simple UUID v4-like token
export function generateInviteToken() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Generate inviteline
export function generateInviteLink(groupId, inviteToken) {
  return `/join-group/${groupId}/${inviteToken}`
}
