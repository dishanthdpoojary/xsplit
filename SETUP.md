# 🚀 Quick Start Guide - XSplit

## Installation & Setup

### Step 1: Install Dependencies
```bash
npm install
```

This will install all required packages:
- React 18.2
- Tailwind CSS
- Vite
- Chart.js
- And other dependencies

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Navigate to `http://localhost:5173` (or the URL shown in terminal)

## First Time Setup

1. **Create an Account**
   - Use any email address (e.g., user@example.com)
   - Set a password
   - Click "Sign Up"

2. **Explore Dashboard**
   - You'll see your financial overview
   - Stats show total expenses, budget, and balances

3. **Add Personal Expenses**
   - Click "Personal" tab
   - Set a monthly budget
   - Add expenses with categories
   - View spending chart

4. **Create Groups**
   - Click "Groups" tab
   - Create a new group with members
   - Add group expenses
   - Test the bill splitting feature

## 📂 Project Structure

```
xsplit/
├── index.html           # Entry HTML file
├── package.json         # Project dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS config
├── postcss.config.js    # PostCSS config
├── src/
│   ├── main.jsx         # React app entry
│   ├── App.jsx          # Main app component
│   ├── index.css        # Global styles + Tailwind
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ExpenseChart.jsx
│   └── screens/
│       ├── AuthScreen.jsx
│       ├── DashboardScreen.jsx
│       ├── PersonalScreen.jsx
│       ├── GroupsScreen.jsx
│       └── GroupDetailScreen.jsx
└── README.md            # Full documentation
```

## 💡 Key Features to Try

### 1. **Personal Expense Tracking**
   - Set different monthly budgets
   - Add expenses
   - View budget alerts
   - See spending chart by category

### 2. **Group Creation & Management**
   - Create groups with multiple members
   - Add shared expenses
   - Copy invite links to share

### 3. **Bill Splitting**
   - Simulate receipt upload
   - View extracted bill items
   - Assign items to members
   - Calculate final amounts

### 4. **Balance Tracking**
   - See who owes whom
   - Track settlement status
   - View transaction history

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  'primary': '#10b981',      // Change primary color
  'secondary': '#06b6d4',    // Change secondary color
  'accent': '#f59e0b',       // Change accent color
}
```

### Add New Categories
Edit `src/screens/PersonalScreen.jsx`:
```javascript
const categories = [
  { value: 'food', label: '🍔 Food' },
  // Add more categories here
]
```

### Modify Simulated Data
Edit `src/screens/GroupDetailScreen.jsx` in `handleSimulateOCR()` function

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Use a different port
npm run dev -- --port 3000
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Build Issues
```bash
# Clear cache and rebuild
rm -rf dist
npm run build
```

## 📦 Building for Production

```bash
# Build optimized version
npm run build

# Preview production build
npm run preview
```

Output will be in `dist/` folder, ready to deploy!

## 🌐 Deployment Options

- **Vercel** (Recommended for Vite)
- **Netlify**
- **GitHub Pages**
- **Firebase Hosting**
- **Any static hosting** (just upload `dist/` folder)

## 📱 Mobile Testing

Open the app URL on your phone to test responsive design. The app is fully mobile-friendly!

## 🐛 Testing Data

All data is stored in browser memory. To reset:
1. Click "Logout"
2. Or clear browser storage
3. Or refresh the page

## 💬 Tips & Tricks

- Use realistic email addresses for group members (e.g., john@example.com)
- Try different categories to see how the chart updates
- Experiment with various amounts to test budget alerts
- Create multiple groups to see how balances are calculated

---

**Enjoy using XSplit! 🎉**
