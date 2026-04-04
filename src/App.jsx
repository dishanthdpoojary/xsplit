import React, { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { logout } from './services/authService'
import ProtectedRoute from './components/ProtectedRoute'
import AuthScreen from './screens/AuthScreen'
import DashboardScreen from './screens/DashboardScreen'
import PersonalScreen from './screens/PersonalScreen'
import GroupsScreen from './screens/GroupsScreen'
import GroupDetailScreen from './screens/GroupDetailScreen'
import JoinRequestPage from './components/JoinRequestPage'
import Navbar from './components/Navbar'
import { Toast, useToast } from './components/Toast'

function App() {
  const { currentUser, loading } = useAuth()
  const [currentScreen, setCurrentScreen] = useState('auth')
  const [joinGroupData, setJoinGroupData] = useState(null) // { groupId, inviteToken }
  const { toast, showToast } = useToast()
  const [appState, setAppState] = useState({
    expenses: [],
    groups: [],
    currentGroupId: null,
    budget: 0,
    transactions: []
  })

  // Auth state listener to intercept currentScreen
  useEffect(() => {
    if (loading) return; // Wait for initial auth check

    if (currentUser && currentScreen === 'auth') {
      setCurrentScreen('dashboard')
    } else if (!currentUser && currentScreen !== 'auth' && currentScreen !== 'join-group') {
      setCurrentScreen('auth')
    }
  }, [currentUser, currentScreen, loading])

  // Check for join group link in URL on mount
  useEffect(() => {
    const path = window.location.pathname
    const joinMatch = path.match(/\/join-group\/(\d+)\/([a-f0-9-]+)/)
    if (joinMatch && currentUser) {
      const groupId = parseInt(joinMatch[1])
      const inviteToken = joinMatch[2]
      setJoinGroupData({ groupId, inviteToken })
      setCurrentScreen('join-group')
    }
  }, [currentUser])

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await logout()
        setAppState({
          expenses: [],
          groups: [],
          currentGroupId: null,
          budget: 0,
          transactions: []
        })
      } catch (err) {
        console.error('Logout failed', err)
      }
    }
  }

  const switchScreen = (screen) => {
    setCurrentScreen(screen)
    if (screen !== 'join-group') {
      setJoinGroupData(null)
    }
  }

  const updateAppState = (updates) => {
    setAppState(prev => ({ ...prev, ...updates }))
  }

  const handleSubmitJoinRequest = (groupId, userEmail) => {
    setAppState(prev => {
      const updatedGroups = prev.groups.map(g => {
        if (g.id === groupId) {
          // Check if already pending or member
          if (g.members.includes(userEmail)) {
            showToast('You\'re already a member of this group', 'info')
            return g
          }

          const alreadyPending = g.pendingRequests?.some(r => r.email === userEmail)
          if (alreadyPending) {
            showToast('Your join request is already pending', 'info')
            return g
          }

          // Add to pending requests
          return {
            ...g,
            pendingRequests: [
              ...(g.pendingRequests || []),
              {
                email: userEmail,
                requestedAt: new Date().toISOString()
              }
            ]
          }
        }
        return g
      })
      return { ...prev, groups: updatedGroups }
    })
    showToast('Join request sent! Awaiting leader approval.', 'success')
    setTimeout(() => switchScreen('groups'), 2000)
  }

  const handleAcceptRequest = (groupId, userEmail) => {
    setAppState(prev => {
      const updatedGroups = prev.groups.map(g => {
        if (g.id === groupId) {
          // Check if group is full
          if (g.members.length >= g.maxMembers) {
            showToast('Group is now full', 'warning')
            return g
          }

          return {
            ...g,
            members: [...g.members, userEmail],
            pendingRequests: g.pendingRequests?.filter(r => r.email !== userEmail) || []
          }
        }
        return g
      })
      return { ...prev, groups: updatedGroups }
    })
    showToast(`${userEmail} was accepted to the group!`, 'success')
  }

  const handleRejectRequest = (groupId, userEmail) => {
    setAppState(prev => {
      const updatedGroups = prev.groups.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            pendingRequests: g.pendingRequests?.filter(r => r.email !== userEmail) || []
          }
        }
        return g
      })
      return { ...prev, groups: updatedGroups }
    })
    showToast(`Join request from ${userEmail} was rejected.`, 'info')
  }

  const handleRemoveMember = (groupId, userEmail) => {
    if (confirm(`Remove ${userEmail} from the group?`)) {
      setAppState(prev => {
        const updatedGroups = prev.groups.map(g => {
          if (g.id === groupId) {
            return {
              ...g,
              members: g.members.filter(m => m !== userEmail)
            }
          }
          return g
        })
        return { ...prev, groups: updatedGroups }
      })
      showToast(`${userEmail} was removed from the group.`, 'success')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Toast toast={toast} />

      {currentUser && currentScreen !== 'join-group' && (
        <Navbar
          currentScreen={currentScreen}
          onScreenChange={switchScreen}
          onLogout={handleLogout}
          userName={currentUser.name}
        />
      )}

      <main>
        {currentScreen === 'auth' && !currentUser && (
          <AuthScreen />
        )}

        {currentScreen === 'dashboard' && (
          <ProtectedRoute>
            <DashboardScreen
              appState={appState}
              currentUser={currentUser}
              onScreenChange={switchScreen}
            />
          </ProtectedRoute>
        )}

        {currentScreen === 'personal' && (
          <ProtectedRoute>
            <PersonalScreen
              appState={appState}
              currentUser={currentUser}
              updateAppState={updateAppState}
            />
          </ProtectedRoute>
        )}

        {currentScreen === 'groups' && (
          <ProtectedRoute>
            <GroupsScreen
              appState={appState}
              currentUser={currentUser}
              updateAppState={updateAppState}
              showToast={showToast}
              onOpenGroup={() => switchScreen('group-detail')}
            />
          </ProtectedRoute>
        )}

        {currentScreen === 'group-detail' && (
          <ProtectedRoute>
            <GroupDetailScreen
              appState={appState}
              currentUser={currentUser}
              updateAppState={updateAppState}
              showToast={showToast}
              onAcceptRequest={handleAcceptRequest}
              onRejectRequest={handleRejectRequest}
              onRemoveMember={handleRemoveMember}
              onBack={() => switchScreen('groups')}
            />
          </ProtectedRoute>
        )}

        {currentScreen === 'join-group' && joinGroupData && (
          <ProtectedRoute>
            <JoinRequestPage
              group={appState.groups.find(g => g.id === joinGroupData.groupId)}
              currentUser={currentUser}
              onSubmitRequest={() => handleSubmitJoinRequest(joinGroupData.groupId, currentUser.email)}
              onCancel={() => switchScreen('groups')}
            />
          </ProtectedRoute>
        )}
      </main>
    </div>
  )
}

export default App
