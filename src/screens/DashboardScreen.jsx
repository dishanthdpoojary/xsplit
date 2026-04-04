import React, { useMemo } from 'react'

function DashboardScreen({ appState, currentUser, onScreenChange }) {
  const stats = useMemo(() => {
    const userExpenses = appState.expenses.filter(e => e.user === currentUser.email)
    const totalExpenses = userExpenses.reduce((sum, e) => sum + e.amount, 0)

    const totalOwe = appState.transactions
      .filter(t => t.from === currentUser.email)
      .reduce((sum, t) => sum + t.amount, 0)

    const totalOwed = appState.transactions
      .filter(t => t.to === currentUser.email)
      .reduce((sum, t) => sum + t.amount, 0)

    return { totalExpenses, totalOwe, totalOwed }
  }, [appState, currentUser])

  const recentExpenses = useMemo(() => {
    const userExpenses = appState.expenses.filter(e => e.user === currentUser.email)
    return userExpenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  }, [appState, currentUser])

  const budgetUsage = appState.budget > 0 
    ? Math.min((stats.totalExpenses / appState.budget) * 100, 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Section Header */}
        <div className="section-header">
          <h1 className="section-title">Dashboard</h1>
          <p className="section-subtitle">Welcome back, {currentUser.name}! Here's your financial overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Expenses */}
          <div className="stat-card group">
            <div className="flex items-center justify-between mb-3">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">💸</div>
              <span className="badge badge-primary">This Month</span>
            </div>
            <div className="text-slate-400 text-sm font-medium mb-1">Total Expenses</div>
            <div className="text-3xl font-bold text-slate-100 mb-2">₹{stats.totalExpenses.toFixed(0)}</div>
            {appState.budget > 0 && (
              <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    stats.totalExpenses > appState.budget 
                      ? 'bg-warning' 
                      : 'bg-gradient-to-r from-primary to-secondary'
                  }`}
                  style={{ width: `${budgetUsage}%` }}
                />
              </div>
            )}
          </div>

          {/* Monthly Budget */}
          <div className="stat-card group">
            <div className="flex items-center justify-between mb-3">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">📊</div>
              <span className="badge badge-primary">Limit</span>
            </div>
            <div className="text-slate-400 text-sm font-medium mb-1">Monthly Budget</div>
            <div className="text-3xl font-bold text-slate-100 mb-2">₹{appState.budget.toFixed(0)}</div>
            <div className="text-xs text-slate-400">
              {appState.budget > 0 
                ? `${Math.round(budgetUsage)}% used`
                : 'Not set'}
            </div>
          </div>

          {/* You Owe */}
          <div className="stat-card group">
            <div className="flex items-center justify-between mb-3">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">📤</div>
              <span className="badge badge-warning">Payable</span>
            </div>
            <div className="text-slate-400 text-sm font-medium mb-1">You Owe</div>
            <div className="text-3xl font-bold text-accent mb-2">₹{stats.totalOwe.toFixed(0)}</div>
            <div className="text-xs text-slate-400">
              {stats.totalOwe > 0 ? 'Settle pending balances' : 'All cleared'}
            </div>
          </div>

          {/* Owed to You */}
          <div className="stat-card group">
            <div className="flex items-center justify-between mb-3">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">📥</div>
              <span className="badge badge-success">Receivable</span>
            </div>
            <div className="text-slate-400 text-sm font-medium mb-1">Owed to You</div>
            <div className="text-3xl font-bold text-primary mb-2">₹{stats.totalOwed.toFixed(0)}</div>
            <div className="text-xs text-slate-400">
              {stats.totalOwed > 0 ? 'Pending from friends' : 'Nothing due'}
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => onScreenChange('personal')}
            className="group relative overflow-hidden rounded-xl p-8 bg-gradient-to-br from-slate-800 to-slate-800/50 
                       border border-primary/20 hover:border-primary/50 transition-all duration-300 
                       hover:shadow-lg-dark text-left"
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="text-4xl mb-3">➕</div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">Add Personal Expense</h3>
              <p className="text-slate-400 text-sm">Track your daily expenses and monitor spending</p>
            </div>
          </button>

          <button
            onClick={() => onScreenChange('groups')}
            className="group relative overflow-hidden rounded-xl p-8 bg-gradient-to-br from-slate-800 to-slate-800/50 
                       border border-secondary/20 hover:border-secondary/50 transition-all duration-300 
                       hover:shadow-lg-dark text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">Manage Groups</h3>
              <p className="text-slate-400 text-sm">Create groups and split expenses with friends</p>
            </div>
          </button>
        </div>

        {/* Recent Expenses */}
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100">Recent Expenses</h2>
              <p className="text-sm text-slate-400 mt-1">Your recent activity</p>
            </div>
            <div className="text-3xl opacity-50">📝</div>
          </div>

          {recentExpenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">
                No expenses yet. Start tracking your spending!
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {recentExpenses.map((expense, index) => (
                <div key={expense.id} className="expense-item group">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-100 group-hover:text-primary transition-colors">
                      {expense.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {new Date(expense.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <span className="expense-category text-xs">
                    {expense.category || 'Other'}
                  </span>
                  <div className="text-lg font-bold text-primary ml-4 text-right">
                    ₹{expense.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardScreen
