# 🔧 Component Architecture & Extension Guide

## Component Hierarchy

```
App.jsx (Root)
├── Navbar.jsx
└── Screen Components
    ├── AuthScreen.jsx
    ├── DashboardScreen.jsx
    ├── PersonalScreen.jsx
    │   └── ExpenseChart.jsx
    ├── GroupsScreen.jsx
    └── GroupDetailScreen.jsx
```

## Data Flow Overview

```
┌─────────────────────────────────┐
│      App.jsx (State)            │
│  - currentUser                  │
│  - appState                     │
│  - updateAppState()             │
└────────────┬────────────────────┘
             │
             ├──→ Navbar (receives: user, screen, handlers)
             │
             └──→ Screens (receive: appState, handlers)
                  │
                  └──→ Child Components (receive: filtered data)
```

## Creating a New Component

### Step 1: Create Component File
```jsx
// src/components/NewComponent.jsx
import React from 'react'

function NewComponent({ data, onAction }) {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-slate-100">Component Title</h2>
      {/* Component content */}
    </div>
  )
}

export default NewComponent
```

### Step 2: Import in Parent
```jsx
// src/screens/SomeScreen.jsx
import NewComponent from '../components/NewComponent'

function SomeScreen() {
  return (
    <div>
      <NewComponent data={data} onAction={handleAction} />
    </div>
  )
}
```

## Creating a New Screen

### Step 1: Create Screen Component
```jsx
// src/screens/NewScreen.jsx
import React, { useState } from 'react'

function NewScreen({ appState, currentUser, updateAppState, onScreenChange }) {
  const [formData, setFormData] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    // Update app state
    updateAppState({ /* changes */ })
  }

  return (
    <div className="container mx-auto px-8 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-100">Screen Title</h1>
        <p className="text-slate-400">Screen description</p>
      </div>

      {/* Screen content */}
    </div>
  )
}

export default NewScreen
```

### Step 2: Add to App.jsx
```jsx
// src/App.jsx
import NewScreen from './screens/NewScreen'

function App() {
  // ... existing code ...

  return (
    <main>
      {/* ... other screens ... */}
      {currentScreen === 'new-screen' && currentUser && (
        <NewScreen
          appState={appState}
          currentUser={currentUser}
          updateAppState={updateAppState}
          onScreenChange={switchScreen}
        />
      )}
    </main>
  )
}
```

### Step 3: Add Navigation
```jsx
// Update Navbar
<li>
  <a 
    href="#" 
    className={`nav-link ${currentScreen === 'new-screen' ? 'active' : ''}`}
    onClick={() => onScreenChange('new-screen')}
  >
    New Screen
  </a>
</li>
```

## Adding New Features

### Feature: Add Expense Filtering

```jsx
// In PersonalScreen.jsx
import React, { useState, useMemo } from 'react'

function PersonalScreen() {
  const [filterCategory, setFilterCategory] = useState('')

  const filteredExpenses = useMemo(() => {
    let filtered = userExpenses

    if (filterCategory) {
      filtered = filtered.filter(e => e.category === filterCategory)
    }

    return filtered
  }, [userExpenses, filterCategory])

  return (
    <div>
      {/* Filter UI */}
      <select 
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="form-select"
      >
        <option value="">All Categories</option>
        <option value="food">Food</option>
        <option value="travel">Travel</option>
      </select>

      {/* Display filtered expenses */}
      {filteredExpenses.map(expense => (
        <div key={expense.id}>{expense.title}</div>
      ))}
    </div>
  )
}
```

### Feature: Delete Expense

```jsx
const handleDeleteExpense = (expenseId) => {
  updateAppState({
    expenses: appState.expenses.filter(e => e.id !== expenseId)
  })
}

// In expense item
<button onClick={() => handleDeleteExpense(expense.id)} className="btn-danger btn-small">
  Delete
</button>
```

### Feature: Edit Expense

```jsx
const [editingExpenseId, setEditingExpenseId] = useState(null)
const [editForm, setEditForm] = useState({})

const handleEditExpense = (expenseId, updates) => {
  updateAppState({
    expenses: appState.expenses.map(e =>
      e.id === expenseId ? { ...e, ...updates } : e
    )
  })
  setEditingExpenseId(null)
}

// Usage
<button 
  onClick={() => {
    setEditingExpenseId(expense.id)
    setEditForm(expense)
  }}
  className="btn-secondary btn-small"
>
  Edit
</button>
```

## Common Patterns

### Loading State
```jsx
const [isLoading, setIsLoading] = useState(false)

const handleFetch = async () => {
  setIsLoading(true)
  try {
    // Fetch data
  } catch (error) {
    console.error(error)
  } finally {
    setIsLoading(false)
  }
}

// Display loader
{isLoading ? (
  <div className="spinner">Loading...</div>
) : (
  <div>{content}</div>
)}
```

### Modal/Dialog
```jsx
const [isModalOpen, setIsModalOpen] = useState(false)

return (
  <>
    <button onClick={() => setIsModalOpen(true)} className="btn-primary">
      Open
    </button>

    {isModalOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full">
          {/* Modal content */}
          <button 
            onClick={() => setIsModalOpen(false)}
            className="btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    )}
  </>
)
```

### Form Validation
```jsx
const [errors, setErrors] = useState({})

const validateForm = (data) => {
  const newErrors = {}

  if (!data.email) newErrors.email = 'Email is required'
  if (data.email && !data.email.includes('@')) newErrors.email = 'Invalid email'
  if (!data.password) newErrors.password = 'Password is required'
  if (data.password && data.password.length < 6) newErrors.password = 'Min 6 characters'

  return newErrors
}

const handleSubmit = (e) => {
  e.preventDefault()
  const validationErrors = validateForm(formData)

  if (Object.keys(validationErrors).length === 0) {
    // Submit form
  } else {
    setErrors(validationErrors)
  }
}

// Display errors
{errors.email && <p className="text-warning text-sm">{errors.email}</p>}
```

### Conditional Rendering
```jsx
{/* Show only if condition is true */}
{isLoggedIn && <Dashboard />}

{/* Ternary operator */}
{expenses.length > 0 ? (
  <ExpenseList expenses={expenses} />
) : (
  <EmptyState message="No expenses" />
)}

{/* Multiple conditions */}
{user && user.isAdmin && <AdminPanel />}

{/* Using && operator */}
{user?.email && <p>Welcome, {user.email}</p>}

{/* Map and filter */}
{expenses
  .filter(e => e.category === 'food')
  .map(e => <ExpenseItem key={e.id} expense={e} />)
}
```

## Using Custom Hooks

### Creating a Custom Hook
```jsx
// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}
```

### Using Custom Hook
```jsx
import { useLocalStorage } from '../hooks/useLocalStorage'

function MyComponent() {
  const [userData, setUserData] = useLocalStorage('user', null)

  return (
    <button onClick={() => setUserData({ name: 'John' })}>
      Save User
    </button>
  )
}
```

## Performance Optimization

### Using useMemo
```jsx
import { useMemo } from 'react'

function MyComponent({ expenses }) {
  // Recalculate only when expenses changes
  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0)
  }, [expenses])

  return <div>Total: {totalExpenses}</div>
}
```

### Using useCallback
```jsx
import { useCallback } from 'react'

function MyComponent({ onUpdate }) {
  // Memoize function to avoid re-renders
  const handleUpdate = useCallback((data) => {
    onUpdate(data)
  }, [onUpdate])

  return <button onClick={() => handleUpdate({ value: 1 })}>Update</button>
}
```

## Error Handling

```jsx
const [error, setError] = useState(null)

const handleAction = async () => {
  try {
    setError(null)
    // Perform action
  } catch (err) {
    setError(err.message || 'An error occurred')
  }
}

{error && (
  <div className="alert alert-danger">
    {error}
  </div>
)}
```

## Testing Components

### Example Test
```jsx
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent data={testData} />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<MyComponent onClick={handleClick} />)
    screen.getByRole('button').click()
    expect(handleClick).toHaveBeenCalled()
  })
})
```

## Best Practices

1. **Keep components small** - One responsibility per component
2. **Use descriptive names** - `UserExpenseList` not `List`
3. **Lift state up** - Share state at parent component
4. **Use custom hooks** - Extract logic to reusable hooks
5. **Add PropTypes** - Validate component props
6. **Memoize expensive calculations** - Use useMemo
7. **Handle loading states** - Show feedback to users
8. **Use semantic HTML** - Use `<button>`, `<form>`, `<input>`
9. **Add accessibility** - aria-labels, keyboard navigation
10. **Keep render methods pure** - No side effects

---

**Happy building! 🚀**
