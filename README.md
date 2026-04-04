# XSplit - Expense Sharing & Personal Finance Management App

A modern, clean web application built with **React.js** and **Tailwind CSS** for managing personal expenses and splitting group expenses.

## 🚀 Features

### Authentication
- Login and Signup with email/password
- Clean, minimal authentication screen
- Session-based user management

### Personal Expense Tracker
- Track daily expenses with title, amount, and category
- Set monthly budget with real-time tracking
- Budget alert system (warns when exceeded)
- Interactive pie chart showing spending by category
- Filter and view expense history

### Group Expense Management
- Create groups and invite members
- Add group expenses that auto-split
- Simulated receipt upload with OCR extraction
- Interactive item assignment to group members
- Bill finalization with automatic calculations

### Balance & Settlement
- View who owes whom
- Settlement screen with clear debt tracking
- Member avatars and quick identification
- Transaction history

## 💻 Tech Stack

- **React 18.2** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Lightning-fast build tool
- **Chart.js** - Data visualization
- **PostCSS** - CSS processing

## 📋 Requirements

- Node.js 14 or higher
- npm or yarn

## 🔧 Installation

1. **Clone or navigate to the project:**
```bash
cd xsplit
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

This will start the Vite dev server, usually at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── App.jsx                 # Main app component
├── main.jsx               # Entry point
├── index.css              # Tailwind CSS config & global styles
├── components/
│   ├── Navbar.jsx         # Navigation bar
│   └── ExpenseChart.jsx   # Chart visualization
└── screens/
    ├── AuthScreen.jsx              # Login/Signup
    ├── DashboardScreen.jsx         # Overview
    ├── PersonalScreen.jsx          # Personal expenses
    ├── GroupsScreen.jsx            # Group management
    └── GroupDetailScreen.jsx       # Group details & bill splitting
```

## 🎨 Design Highlights

- **Color Scheme**: Primary Green (#10b981), Secondary Cyan (#06b6d4), Accent Gold (#f59e0b)
- **Dark Theme**: Modern dark background with gradient
- **Responsive Design**: Mobile-first approach, works on all devices
- **Smooth Animations**: Fade-in effects and hover interactions
- **Clean Cards**: Rounded corners with border effects
- **Icons & Emojis**: Visual indicators for better UX

## 📱 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Usage Guide

### 1. **Authentication**
   - Sign up with email and password
   - Or sign in if you already have an account
   - All data is stored in browser session

### 2. **Personal Expenses**
   - Navigate to "Personal" tab
   - Set monthly budget
   - Add expenses with category
   - View spending chart and alerts
   - Track budget vs actual spending

### 3. **Group Expenses**
   - Click "Groups" to view all groups
   - Create a new group with members
   - Copy and share invite links
   - Add expenses to group
   - Upload receipts and split items

### 4. **Bill Splitting**
   - Upload receipt image (simulated OCR)
   - View & edit extracted items
   - Assign items to specific members
   - Finalize split for automatic calculations

### 5. **Settlement**
   - View balance details for each group
   - See who owes whom
   - Track transactions
   - Mark settlements as complete

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## 🔐 Data Privacy

- All data is stored in browser's local state
- No backend server required
- Data resets on logout or page refresh
- Perfect for testing and demo purposes

## 📚 Component API

### App
Main container managing app state and navigation

### AuthScreen
Handles user authentication (login/signup)

### DashboardScreen
Shows overview of all expenses and balances

### PersonalScreen
Personal expense management with charts

### GroupsScreen
Create and manage expense groups

### GroupDetailScreen
Group expenses, bill splitting, and settlement

## 🎓 Future Enhancements

- [ ] Backend integration with database
- [ ] Real receipt OCR using API
- [ ] Push notifications for settlements
- [ ] Email sharing of expense reports
- [ ] Mobile app version
- [ ] Export expense reports as PDF
- [ ] Recurring expenses
- [ ] Expense categories analytics
- [ ] Multi-currency support
- [ ] Payment gateway integration

## 🤝 Contributing

Feel free to customize and extend this application!

## 📄 License

MIT License - feel free to use this for personal or commercial projects.

## 👨‍💻 Author

Created as a modern expense sharing solution.

---

**Happy budgeting! 💰**
