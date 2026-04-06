# XSplit — Expense Splitting App

XSplit is a React web application for tracking and splitting expenses — both personally and within groups. It supports receipt scanning via OCR, real-time charts, invite-link-based group joining, and smart debt simplification.

## Features

- **Authentication** — Sign up and log in with Firebase Authentication.
- **Personal Expense Tracking** — Log personal expenses by category, set a monthly budget, and visualise spending with charts.
- **Group Expense Splitting** — Create groups, add shared expenses, and split costs evenly among members.
- **Debt Simplification** — Automatically minimises the number of transactions needed to settle all balances within a group.
- **Receipt Scanning** — Upload or drag-and-drop a receipt image; Tesseract OCR extracts the merchant name, line items, and total.
- **Invite Links** — Share a unique invite link so others can request to join your group; group leaders approve or reject requests.
- **Member Management** — Leaders can remove members and manage pending join requests.

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18, Tailwind CSS |
| Build | Vite |
| Backend / DB | Firebase (Firestore, Auth) |
| Charts | Chart.js, react-chartjs-2 |
| OCR | Tesseract (via local OCR server) |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A Firebase project with **Firestore** and **Authentication** (Email/Password) enabled

### Installation

```bash
git clone https://github.com/dishanthdpoojary/xsplit.git
cd xsplit
npm install
```

### Firebase Configuration

1. Go to your [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Copy your Firebase web app config.
3. Update `src/firebase/firebase.js` with your project credentials.
4. Deploy the Firestore security rules from `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

### Running the App

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The app will be available at `http://localhost:5173` by default.

### OCR Server (optional)

Receipt scanning requires a local OCR server running at `http://localhost:3000`. Without it the receipt scanner will display an error, but all other features work normally.

## Project Structure

```
xsplit/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── CreateGroupForm.jsx
│   │   ├── ExpenseChart.jsx
│   │   ├── InviteLinkCard.jsx
│   │   ├── JoinRequestPage.jsx
│   │   ├── MembersList.jsx
│   │   ├── Navbar.jsx
│   │   ├── PendingRequestsList.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── ReceiptScanner.jsx
│   │   └── Toast.jsx
│   ├── context/
│   │   └── AuthContext.jsx   # Firebase auth state provider
│   ├── firebase/
│   │   └── firebase.js       # Firebase app initialisation
│   ├── screens/              # Top-level page components
│   │   ├── AuthScreen.jsx
│   │   ├── DashboardScreen.jsx
│   │   ├── GroupDetailScreen.jsx
│   │   ├── GroupsScreen.jsx
│   │   └── PersonalScreen.jsx
│   ├── services/
│   │   ├── authService.js    # Auth helpers (login, logout, register)
│   │   └── ocrService.js     # Receipt OCR API calls
│   └── utils/
│       └── uuid.js
├── backend/
│   ├── services/
│   │   ├── authService.js
│   │   ├── expenseService.js
│   │   └── groupService.js
│   └── utils/
│       ├── generateToken.js  # Invite token generation
│       └── splitLogic.js     # Balance calculation & debt simplification
├── firestore.rules
├── tailwind.config.js
└── vite.config.js
```

## Debt Simplification Algorithm

`backend/utils/splitLogic.js` implements two functions:

- **`calculateBalances(expenses, members)`** — Computes each member's net balance (positive = should receive money, negative = owes money).
- **`simplifyDebts(balances)`** — Uses a greedy creditor–debtor matching algorithm to produce the minimum number of transactions needed to settle all debts.

## Firestore Security Rules

- Users can only read/write their own user document.
- Any authenticated user can read or create groups.
- Only the group leader (`leaderId`) can update or delete a group.

## License

MIT
