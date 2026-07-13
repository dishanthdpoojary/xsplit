import React, { useState, useMemo } from 'react'
import PendingRequestsList from '../components/PendingRequestsList'
import MembersList from '../components/MembersList'
import ReceiptScanner from '../components/ReceiptScanner'

function GroupDetailScreen({ appState, currentUser, updateAppState, showToast, onAcceptRequest, onRejectRequest, onRemoveMember, onBack }) {
  const group = appState.groups.find(g => g.id === appState.currentGroupId)
  const [activeTab, setActiveTab] = useState('members')
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    paidBy: ''
  })
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState({ name: '', price: '' })
  const [showItemsTable, setShowItemsTable] = useState(false)
  const [scanError, setScanError] = useState('')
  const [scanMerchant, setScanMerchant] = useState('')

  if (!group) return null

  const isLeader = group.creator === currentUser.email

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (expenseForm.title && expenseForm.amount && expenseForm.paidBy) {
      const expense = {
        id: Date.now(),
        title: expenseForm.title,
        amount: parseFloat(expenseForm.amount),
        paidBy: expenseForm.paidBy,
        date: new Date().toISOString().split('T')[0],
        splitAmong: group.members.filter(m => m !== expenseForm.paidBy)
      }

      const updatedGroup = {
        ...group,
        expenses: [...group.expenses, expense]
      }

      const transactions = []
      const perPerson = expense.amount / group.members.length
      group.members.forEach(member => {
        if (member !== expense.paidBy) {
          transactions.push({
            from: member,
            to: expense.paidBy,
            amount: perPerson,
            description: expense.title
          })
        }
      })

      updateAppState({
        groups: appState.groups.map(g => g.id === group.id ? updatedGroup : g),
        transactions: [...appState.transactions, ...transactions]
      })

      setExpenseForm({ title: '', amount: '', paidBy: '' })
      showToast('Expense added!', 'success')
    }
  }

  const handleScanComplete = (ocrData) => {
    setScanError('')
    setScanMerchant(ocrData.merchant || '')

    // Map OCR items (price as string) to our format
    const parsed = (ocrData.items || []).map(i => ({
      name: i.item || i.name || 'Unknown item',
      price: parseFloat(i.price) || 0
    })).filter(i => i.price > 0)

    // If no items but total present, create a single entry from the merchant
    if (parsed.length === 0 && ocrData.total) {
      parsed.push({
        name: ocrData.merchant || 'Receipt total',
        price: parseFloat(ocrData.total) || 0
      })
    }

    setItems(parsed)
    setShowItemsTable(parsed.length > 0)
  }

  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      setItems([...items, { name: newItem.name, price: parseFloat(newItem.price) }])
      setNewItem({ name: '', price: '' })
    }
  }

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleFinalizeItemSplit = () => {
    const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.price), 0)
    if (totalAmount <= 0) return

    // Pre-fill the expense form then switch to the expenses tab
    setExpenseForm({
      title: scanMerchant ? `${scanMerchant} (receipt)` : 'Scanned receipt',
      amount: totalAmount.toFixed(2),
      paidBy: currentUser.email
    })
    setItems([])
    setShowItemsTable(false)
    setScanMerchant('')
    setActiveTab('expenses')
    showToast(`Receipt scanned! ₹${totalAmount.toFixed(2)} auto-filled — review and submit.`, 'success')
  }

  const groupBalance = useMemo(() => {
    const balances = {}
    group.members.forEach(member => {
      balances[member] = 0
    })

    group.expenses.forEach(expense => {
      const perPerson = expense.amount / (group.members.length - 1)
      group.members.forEach(member => {
        if (member !== expense.paidBy) {
          balances[member] -= perPerson
        }
      })
      balances[expense.paidBy] += expense.amount - (expense.amount / group.members.length)
    })

    return Object.entries(balances).map(([member, balance]) => ({
      member,
      balance,
      status: balance > 0 ? 'owed' : balance < 0 ? 'owes' : 'settled'
    }))
  }, [group])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={onBack} 
          className="btn-outline btn-sm mb-8 hover:bg-slate-800/50 transition-colors"
        >
          ← Back to Groups
        </button>

        {/* Section Header */}
        <div className="section-header mb-8">
          <h1 className="section-title flex items-center gap-3">
            <span>👥</span>
            <span>{group.name}</span>
            {isLeader && <span className="badge badge-primary text-xs">👑 Leader</span>}
          </h1>
          <p className="section-subtitle">
            {group.members.length}/{group.maxMembers || '∞'} members • {(group.expenses?.length || 0)} expense{(group.expenses?.length || 0) !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="tabs mb-8">
          <button
            onClick={() => setActiveTab('members')}
            className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
          >
            👥 Members
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`tab-button ${activeTab === 'expenses' ? 'active' : ''}`}
          >
            💸 Expenses
          </button>
          <button
            onClick={() => setActiveTab('bill')}
            className={`tab-button ${activeTab === 'bill' ? 'active' : ''}`}
          >
            📸 Split Bill
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`tab-button ${activeTab === 'balance' ? 'active' : ''}`}
          >
            ⚖️ Balances
          </button>
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-8">
            <MembersList
              group={group}
              currentUser={currentUser}
              onRemoveMember={(email) => onRemoveMember(group.id, email)}
            />

            {isLeader && (
              <PendingRequestsList
                group={group}
                currentUser={currentUser}
                onAccept={(email) => onAcceptRequest(group.id, email)}
                onReject={(email) => onRejectRequest(group.id, email)}
              />
            )}
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="space-y-8">
            {/* Add Expense Form */}
            <div className="card-elevated">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Add Expense</h2>
                  <p className="text-sm text-slate-400 mt-1">Record a shared expense</p>
                </div>
                <span className="text-4xl opacity-50">➕</span>
              </div>
              
              <form onSubmit={handleAddExpense} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="form-group">
                    <label htmlFor="expense-title" className="form-label">Title</label>
                    <input
                      id="expense-title"
                      type="text"
                      value={expenseForm.title}
                      onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                      placeholder="e.g., Dinner, Movie tickets"
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
                    <label htmlFor="expense-paid-by" className="form-label">Paid By</label>
                    <select
                      id="expense-paid-by"
                      value={expenseForm.paidBy}
                      onChange={(e) => setExpenseForm({ ...expenseForm, paidBy: e.target.value })}
                      className="form-input"
                      required
                    >
                      <option value="">Select member</option>
                      {group.members.map(m => (
                        <option key={m} value={m}>
                          {m === currentUser.email ? '(You) ' : ''}{m}
                        </option>
                      ))}
                    </select>
                  </div>
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
                  <h2 className="text-xl font-bold text-slate-100">Group Expenses</h2>
                  <p className="text-sm text-slate-400 mt-1">{group.expenses?.length || 0} transaction{(group.expenses?.length || 0) !== 1 ? 's' : ''}</p>
                </div>
                <span className="text-4xl opacity-50">💳</span>
              </div>
              
              {!group.expenses || group.expenses.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <div className="empty-state-text">
                    No expenses yet. Add an expense to get started!
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {group.expenses.map(expense => (
                    <div key={expense.id} className="expense-item group">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-100 group-hover:text-primary transition-colors">
                          {expense.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Paid by {expense.paidBy === currentUser.email ? 'you' : expense.paidBy}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        ₹{expense.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bill Split Tab */}
        {activeTab === 'bill' && (
          <div className="space-y-8">
            {/* Upload Area */}
            <div className="card-elevated">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Scan Receipt</h2>
                  <p className="text-sm text-slate-400 mt-1">Upload a photo to auto-extract items and prices</p>
                </div>
                <span className="text-4xl opacity-50">📸</span>
              </div>

              <ReceiptScanner
                onScanComplete={handleScanComplete}
                onError={(msg) => setScanError(msg)}
              />

              {scanError && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {scanError}
                </div>
              )}
            </div>

            {/* Items Table */}
            {showItemsTable && (
              <div className="card-elevated">
                {scanMerchant && (
                  <div className="mb-4 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                    🏪 Merchant detected: <strong>{scanMerchant}</strong>
                  </div>
                )}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">Bill Items</h2>
                    <p className="text-sm text-slate-400 mt-1">Extracted items from receipt</p>
                  </div>
                  <span className="text-4xl opacity-50">🧾</span>
                </div>

                {/* Items List */}
                <div className="mb-6 space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="expense-item group">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-100">{item.name}</div>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        ₹{item.price.toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="btn-danger btn-sm ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Item */}
                <div className="divider my-6" />
                
                <div className="form-group mb-6">
                  <label className="form-label">Add New Item</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Item name"
                      className="form-input"
                    />
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      placeholder="Price (₹)"
                      min="0"
                      step="0.01"
                      className="form-input"
                    />
                    <button onClick={handleAddItem} className="btn-primary">
                      Add Item
                    </button>
                  </div>
                </div>

                {/* Total */}
                {items.length > 0 && (
                  <div className="stat-card bg-gradient-to-br from-primary-dark/20 to-primary-dark/10 border border-primary-dark/50 mb-6">
                    <div className="text-slate-400 text-sm font-medium mb-2">Total Amount</div>
                    <div className="text-4xl font-bold text-primary">
                      ₹{items.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)}
                    </div>
                  </div>
                )}

                <button onClick={handleFinalizeItemSplit} className="btn-primary w-full py-3">
                  💰 Finalize Split
                </button>
              </div>
            )}
          </div>
        )}

        {/* Balance Tab */}
        {activeTab === 'balance' && (
          <div className="card-elevated">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Settlement</h2>
                <p className="text-sm text-slate-400 mt-1">Who owes who money</p>
              </div>
              <span className="text-4xl opacity-50">⚖️</span>
            </div>

            {groupBalance.every(b => b.status === 'settled') ? (
              <div className="empty-state">
                <div className="text-6xl mb-3">✓</div>
                <div className="text-lg font-bold text-primary">All settled!</div>
                <p className="text-sm text-slate-400 mt-1">Everyone has paid their share</p>
              </div>
            ) : (
              <div className="space-y-3">
                {groupBalance.map((item, idx) => (
                  (item.status !== 'settled') && (
                    <div key={idx} className="split-item group">
                      <div className="flex gap-3 items-center flex-1">
                        <div className="split-avatar">{item.member.charAt(0).toUpperCase()}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-100 truncate">
                            {item.member === currentUser.email ? '(You) ' : ''}{item.member}
                          </div>
                          <div className="text-sm text-slate-400">
                            {item.status === 'owed' ? '✓ Should receive' : '⚠️ Should pay'}
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${item.status === 'owed' ? 'text-primary' : 'text-accent'}`}>
                        ₹{Math.abs(item.balance).toFixed(2)}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupDetailScreen
