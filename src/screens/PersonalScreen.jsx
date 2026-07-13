import React, { useState, useEffect, useMemo } from 'react'
import ExpenseChart from '../components/ExpenseChart'
import ReceiptScanner from '../components/ReceiptScanner'

function PersonalScreen({ appState, currentUser, updateAppState }) {
  const [budgetInput, setBudgetInput] = useState('')
  const [showReceiptScanner, setShowReceiptScanner] = useState(false)
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  })

  const userExpenses = useMemo(
    () => appState.expenses.filter(e => e.user === currentUser.email),
    [appState.expenses, currentUser]
  )

  const totalExpenses = useMemo(
    () => userExpenses.reduce((sum, e) => sum + e.amount, 0),
    [userExpenses]
  )

  const budgetAlert = useMemo(() => {
    if (appState.budget === 0) return null

    if (totalExpenses > appState.budget) {
      const exceeded = totalExpenses - appState.budget
      return {
        type: 'warning',
        message: `⚠️ Budget Exceeded! You've spent ₹${exceeded.toFixed(2)} more than your budget of ₹${appState.budget.toFixed(0)}`
      }
    } else {
      const remaining = appState.budget - totalExpenses
      return {
        type: 'success',
        message: `✓ On Track! You have ₹${remaining.toFixed(2)} left in your budget`
      }
    }
  }, [appState.budget, totalExpenses])

  const handleSetBudget = () => {
    const amount = parseFloat(budgetInput)
    if (amount > 0) {
      updateAppState({ budget: amount })
      setBudgetInput('')
    }
  }

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (expenseForm.title && expenseForm.amount && expenseForm.category) {
      const newExpense = {
        id: Date.now(),
        ...expenseForm,
        amount: parseFloat(expenseForm.amount),
        user: currentUser.email
      }
      updateAppState({
        expenses: [...appState.expenses, newExpense]
      })
      setExpenseForm({
        title: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
      })
    }
  }

  const handleDeleteExpense = (expenseId) => {
    updateAppState({
      expenses: appState.expenses.filter(e => e.id !== expenseId)
    })
  }

  const handlePersonalScanComplete = (ocrData) => {
    // Auto-fill form from OCR data
    const total = ocrData.total || (
      ocrData.items?.reduce((sum, i) => sum + (parseFloat(i.price) || 0), 0)
    )
    setExpenseForm(prev => ({
      ...prev,
      title: ocrData.merchant || 'Scanned receipt',
      amount: total ? parseFloat(total).toFixed(2) : prev.amount,
      category: 'food',
    }))
    setShowReceiptScanner(false)
  }

  const categories = [
    { value: 'food', label: '🍔 Food' },
    { value: 'travel', label: '🚗 Travel' },
    { value: 'entertainment', label: '🎬 Entertainment' },
    { value: 'shopping', label: '🛍️ Shopping' },
    { value: 'utilities', label: '💡 Utilities' },
    { value: 'other', label: '📝 Other' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8 space-y-8">
        {/* Section Header */}
        <div className="section-header">
          <h1 className="section-title">Personal Expense Tracker</h1>
          <p className="section-subtitle">Track your daily expenses, set budgets, and visualize spending patterns</p>
        </div>

        {/* Budget Alert */}
        {budgetAlert && (
          <div className={`alert ${budgetAlert.type === 'warning' ? 'alert-warning' : 'alert-success'}`}>
            <div className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">{budgetAlert.type === 'warning' ? '⚠️' : '✓'}</span>
              <span className="text-sm">{budgetAlert.message}</span>
            </div>
          </div>
        )}

        {/* Budget Section */}
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100">Monthly Budget</h2>
              <p className="text-sm text-slate-400 mt-1">Set and track your spending limit</p>
            </div>
            <span className="text-4xl opacity-50">💰</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="budget-input" className="form-label">Set Monthly Budget</label>
              <div className="flex gap-3 mt-2">
                <input
                  id="budget-input"
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="Enter budget amount"
                  min="0"
                  className="form-input flex-1"
                />
                <button onClick={handleSetBudget} className="btn-primary px-6">
                  Set
                </button>
              </div>
            </div>
            
            <div className="stat-card bg-gradient-to-br from-primary-dark/20 to-primary-dark/10 border border-primary-dark/50">
              <div className="text-slate-400 text-sm font-medium mb-2">Current Budget</div>
              <div className="text-4xl font-bold text-primary mb-1">₹{appState.budget.toFixed(0)}</div>
              <div className="text-xs text-slate-500">
                {appState.budget > 0 ? 'Budget set' : 'No budget set'}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        {userExpenses.length > 0 && (
          <div className="card-elevated">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Spending by Category</h2>
                <p className="text-sm text-slate-400 mt-1">Your expense distribution</p>
              </div>
              <span className="text-4xl opacity-50">📊</span>
            </div>
            <div className="h-80 rounded-lg bg-slate-800/30 p-4 border border-slate-700/50">
              <ExpenseChart expenses={userExpenses} />
            </div>
          </div>
        )}

        {/* Add Expense Form */}
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100">Add New Expense</h2>
              <p className="text-sm text-slate-400 mt-1">Record your spending instantly</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowReceiptScanner(prev => !prev)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  showReceiptScanner
                    ? 'bg-primary/20 text-primary border-primary/30'
                    : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                {showReceiptScanner ? '✕ Close Scanner' : '📸 Scan Receipt'}
              </button>
              <span className="text-4xl opacity-50">➕</span>
            </div>
          </div>

          {/* Receipt Scanner Panel */}
          {showReceiptScanner && (
            <div className="mb-6 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-4">
                Upload a receipt photo to auto-fill the form below.
              </p>
              <ReceiptScanner
                onScanComplete={handlePersonalScanComplete}
                onError={() => {}}
              />
            </div>
          )}
          
          <form onSubmit={handleAddExpense} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="md:col-span-2 form-group">
                <label htmlFor="expense-title" className="form-label">Title</label>
                <input
                  id="expense-title"
                  type="text"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  placeholder="e.g., Lunch at restaurant"
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="expense-amount" className="form-label">Amount (₹)</label>
                <input
                  id="expense-amount"
                  type="number"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="expense-category" className="form-label">Category</label>
                <select
                  id="expense-category"
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="form-input"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="expense-date" className="form-label">Date</label>
              <input
                id="expense-date"
                type="date"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                className="form-input"
                required
              />
            </div>
            
            <button type="submit" className="btn-primary w-full py-3">
              ➕ Add Expense
            </button>
          </form>
        </div>

        {/* Expenses List */}
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100">Your Expenses</h2>
              <p className="text-sm text-slate-400 mt-1">{userExpenses.length} expense{userExpenses.length !== 1 ? 's' : ''} recorded</p>
            </div>
            <span className="text-4xl opacity-50">💳</span>
          </div>
          
          {userExpenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">
                No expenses yet. Start tracking your spending!
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {userExpenses.map(expense => (
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
                    {categories.find(c => c.value === expense.category)?.label}
                  </span>
                  <div className="text-lg font-bold text-primary ml-4">
                    ₹{expense.amount.toFixed(2)}
                  </div>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="btn-danger btn-sm ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonalScreen
