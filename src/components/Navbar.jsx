import React from 'react'

function Navbar({ currentScreen, onScreenChange, onLogout, userName }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'personal', label: 'Personal', icon: '💰' },
    { id: 'groups', label: 'Groups', icon: '👥' }
  ]

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 shadow-md-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              XSplit
            </div>
            <div className="hidden md:block text-xs text-slate-400 font-medium tracking-wider ml-4 px-3 py-1 bg-slate-800/50 rounded-full">
              EXPENSE SPLITTER
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onScreenChange(item.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                  transition-all duration-200 whitespace-nowrap
                  ${currentScreen === item.id
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }
                `}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <div className="text-sm font-semibold text-slate-200">{userName}</div>
              <div className="text-xs text-slate-500">Logged in</div>
            </div>
            <div className="w-px h-6 bg-slate-700/50 hidden sm:block" />
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-warning/10 text-warning hover:bg-warning/20 
                         font-semibold text-sm rounded-lg transition-all duration-200 
                         border border-warning/20 hover:border-warning/40"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-1 pb-3 -mx-6 px-6 overflow-x-auto pb-4">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className={`
                flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm
                transition-all duration-200 whitespace-nowrap flex-shrink-0
                ${currentScreen === item.id
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }
              `}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
