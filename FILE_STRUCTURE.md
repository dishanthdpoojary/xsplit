# 📚 Complete File Structure & Documentation

## 📁 Project Root Files

### Configuration Files

| File | Purpose | What to Edit |
|------|---------|--------------|
| `package.json` | Project dependencies & scripts | Add new packages here |
| `vite.config.js` | Vite build configuration | Vite plugins and settings |
| `tailwind.config.js` | Tailwind CSS customization | Colors, fonts, themes |
| `postcss.config.js` | PostCSS plugin configuration | CSS processing plugins |
| `.gitignore` | Git ignore patterns | Exclude files from version control |
| `.env.example` | Environment variable template | Copy to `.env` for local config |

### Entry Point
| File | Purpose |
|------|---------|
| `index.html` | Vite HTML entry file (minimal) |

### Documentation
| File | Purpose |
|------|---------|
| `README.md` | Complete feature documentation |
| `SETUP.md` | Quick start & setup guide |
| `CONVERSION_GUIDE.md` | React conversion summary |
| `TAILWIND_REFERENCE.md` | Tailwind CSS class reference |
| `COMPONENT_GUIDE.md` | Component architecture & how-to |
| `FILE_STRUCTURE.md` | This file - file overview |

---

## 🧩 Source Code Structure

### `src/main.jsx` - React Entry Point
```javascript
- Imports React and App
- Creates root React render
- Mounts app to #root DOM element
```

**When to edit**: Almost never - core bootstrap file

---

### `src/App.jsx` - Root Application Component
```javascript
- Main state management (appState, currentUser)
- Screen routing logic
- Props passing to child components
- updateAppState() function for state updates
```

**Key Features**:
- Manages authentication state
- Routes between screens
- Provides state update function
- Controls navbar visibility

**When to edit**:
- Add new screens
- Modify state structure
- Add new routes

---

### `src/index.css` - Global Styles
```css
- Tailwind CSS imports
- @layer directives
- Custom component classes
- Global utility classes
```

**Custom Components Defined**:
- `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-outline`
- `.card`, `.stat-card`, `.group-card`
- `.form-input`, `.form-select`, `.form-textarea`
- `.alert`, `.alert-warning`, `.alert-success`, `.alert-danger`
- `.expense-item`, `.expense-category`
- `.split-item`, `.split-avatar`
- `.upload-area`, `.items-table`
- `.tabs`, `.tab-button`

---

## 📱 Components Directory (`src/components/`)

### `Navbar.jsx` - Navigation Component
```jsx
Function: Navigation bar with user info and logout
Props:
  - currentScreen: string
  - onScreenChange: function
  - onLogout: function
  - userName: string
```

**Features**:
- Screen navigation
- Active link highlighting
- Logout button
- Responsive design

**When to edit**:
- Add navigation items
- Change navbar styling
- Modify logout flow

---

### `ExpenseChart.jsx` - Chart Visualization
```jsx
Function: Displays pie chart of expenses by category
Props:
  - expenses: array of expense objects
```

**Features**:
- Uses Chart.js with react-chartjs-2
- Shows category breakdown
- Displays emojis for categories
- Responsive sizing

**When to edit**:
- Change chart type
- Modify colors
- Adjust data calculations

---

## 📺 Screens Directory (`src/screens/`)

### `AuthScreen.jsx` - Authentication
```jsx
Function: Login and signup interface
Props:
  - onLogin: function(email)
```

**Features**:
- Email/password input
- Toggle signup/login modes
- Password confirmation
- Form validation

**Form State**:
```javascript
{
  email: string,
  password: string,
  confirmPassword: string (signup only)
}
```

**When to edit**:
- Modify form fields
- Add additional validation
- Change auth method

---

### `DashboardScreen.jsx` - Financial Overview
```jsx
Function: Main dashboard with stats and recent expenses
Props:
  - appState: { expenses, budget, transactions }
  - currentUser: { email, name }
  - onScreenChange: function
```

**Features**:
- 4 stat cards (total, budget, owe, owed)
- Recent expenses list
- Quick action buttons
- Responsive grid layout

**Computed Values**:
- `stats.totalExpenses` - Sum of user expenses
- `stats.totalOwe` - Sum of transactions where user is "from"
- `stats.totalOwed` - Sum of transactions where user is "to"

**When to edit**:
- Add more stats
- Modify stat calculations
- Change recent expenses limit

---

### `PersonalScreen.jsx` - Personal Expenses
```jsx
Function: Track personal expenses and set budgets
Props:
  - appState: { expenses, budget }
  - currentUser: { email, name }
  - updateAppState: function
```

**Features**:
- Monthly budget setter
- Budget alert system
- Expense form (title, amount, category, date)
- Expense list with delete
- Integration with ExpenseChart
- Category filtering

**Expense State**:
```javascript
{
  id: number,
  title: string,
  amount: number,
  category: string,
  date: string (ISO),
  user: string (email)
}
```

**Categories**:
```javascript
['food', 'travel', 'entertainment', 'shopping', 'utilities', 'other']
```

**When to edit**:
- Add expense types
- Modify budget formula
- Change alert thresholds
- Add more filters

---

### `GroupsScreen.jsx` - Group Management
```jsx
Function: Create and manage expense groups
Props:
  - appState: { groups }
  - currentUser: { email, name }
  - updateAppState: function
  - onOpenGroup: function
```

**Features**:
- Create new groups
- Display all groups
- Add members via email
- Copy invite links
- Delete groups
- View member count and expenses

**Group Structure**:
```javascript
{
  id: number,
  name: string,
  members: array (emails),
  creator: string (email),
  expenses: array,
  items: array
}
```

**When to edit**:
- Modify group creation
- Add group search
- Change member limit
- Add group editing

---

### `GroupDetailScreen.jsx` - Group Details & Splitting
```jsx
Function: View group details, split bills, track balances
Props:
  - appState: { groups, currentGroupId, transactions }
  - currentUser: { email, name }
  - updateAppState: function
  - onBack: function
```

**Features**:
- 3 tabs: Expenses, Bill Split, Balances
- Add group expenses
- Simulated receipt upload
- Item-by-item assignment
- Automatic balance calculation
- Settlement status

**Tabs**:

1. **Expenses Tab**
   - Add expense form
   - Expense list
   - Paid by tracking

2. **Bill Tab**
   - Upload area
   - Simulated OCR
   - Item table with editing
   - Add new items
   - Finalize split

3. **Balance Tab**
   - Balance summary
   - Who owes whom
   - Settlement status

**When to edit**:
- Modify expense splitting logic
- Change balance calculation
- Add real OCR API
- Modify settlement flow

---

## 🔄 Data Flow

### State Structure (AppState)
```javascript
{
  expenses: [
    { id, title, amount, category, date, user }
  ],
  groups: [
    { id, name, members, creator, expenses, items }
  ],
  currentGroupId: null,
  budget: 0,
  transactions: [
    { from, to, amount, description }
  ]
}
```

### User Object
```javascript
{
  email: string,
  name: string
}
```

---

## 🎯 Quick Edit Locations

### Add New Category
**File**: `src/screens/PersonalScreen.jsx`
**Location**: `categories` array
```javascript
const categories = [
  { value: 'food', label: '🍔 Food' },
  // Add here
]
```

### Change Primary Color
**File**: `tailwind.config.js`
**Location**: theme.extend.colors
```javascript
colors: {
  'primary': '#NEW_COLOR',
}
```

### Modify Budget Alert Threshold
**File**: `src/screens/PersonalScreen.jsx`
**Location**: `budgetAlert` useMemo
```javascript
if (totalExpenses > appState.budget * 1.1) { // Modify multiplier
```

### Change Simulated OCR Data
**File**: `src/screens/GroupDetailScreen.jsx`
**Location**: `handleSimulateOCR` function
```javascript
const simulatedItems = [
  // Modify items here
]
```

### Add New Screen
1. Create file in `src/screens/`
2. Import in `App.jsx`
3. Add condition in render
4. Add navigation link in `Navbar.jsx`

### Add New Component
1. Create file in `src/components/`
2. Import where needed
3. Pass required props
4. Style with existing classes

---

## 📊 Important Functions

### updateAppState
**Location**: `App.jsx`
**Usage**: `updateAppState({ key: value })`
**Purpose**: Update app state immutably
```javascript
updateAppState({
  expenses: [...appState.expenses, newExpense]
})
```

### switchScreen
**Location**: `App.jsx`
**Usage**: `switchScreen('screen-name')`
**Purpose**: Navigate to different screen

### handleLogin
**Location**: `App.jsx`
**Usage**: `handleLogin(email)`
**Purpose**: Authenticate user

---

## 🚀 Build & Deployment Scripts

### Available Scripts (in package.json)
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Dependencies
- react: ^18.2.0
- react-dom: ^18.2.0
- chart.js: ^4.4.0
- react-chartjs-2: ^5.2.0

### Dev Dependencies
- @vitejs/plugin-react: ^4.2.1
- vite: ^5.0.8
- tailwindcss: ^3.3.6
- postcss: ^8.4.32
- autoprefixer: ^10.4.16

---

## 📝 Comment Conventions

Use this style for comments:

```jsx
// Descriptive comment about what follows
const [state, setState] = useState(initialValue)

// Another comment
function handleAction() {
  // Inline comment explaining logic
  setState(newValue)
}
```

---

## ✅ Testing Your Changes

1. **Edit a component**
2. **Save the file** - Vite auto-refreshes
3. **Check browser** - Changes appear instantly
4. **Use React DevTools** - Inspect components
5. **Check console** - Look for errors

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Styles not applying | Check class name spelling, rebuild Tailwind |
| Component not showing | Check screen rendering logic in App.jsx |
| State not updating | Use updateAppState correctly, check immutability |
| Data lost on refresh | Data is in-memory only, use localStorage for persistence |
| Chart not showing | Ensure ExpenseChart is imported, has data |

---

## 📖 File Dependencies

```
App.jsx
├── All screens
├── Navbar.jsx
└── State management

PersonalScreen.jsx
└── ExpenseChart.jsx

GroupDetailScreen.jsx
└── (No dependencies)

AuthScreen.jsx
└── (No dependencies)
```

---

## 💾 How to Add Persistence

Replace state-only approach with localStorage:

```jsx
// In App.jsx
const [appState, setAppState] = useState(() => {
  const saved = localStorage.getItem('appState')
  return saved ? JSON.parse(saved) : initialState
})

useEffect(() => {
  localStorage.setItem('appState', JSON.stringify(appState))
}, [appState])
```

---

**Last Updated**: April 4, 2026
**Version**: React 18 + Tailwind CSS 3
**Status**: Production Ready ✅
