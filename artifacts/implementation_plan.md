# Firebase Authenticaton and Firestore Integration

This plan describes how we'll introduce a real authentication flow and a connected backend database to XSplit using Firebase's modern SDK (v9).

## User Review Required

> [!IMPORTANT]
> **React Router vs. Existing State Routing:**
> Right now, the application switches "screens" using basic React state (`currentScreen`). The feature request asks for a `ProtectedRoute` component to handle route access, which strongly signals React Router `react-router-dom` usage. 
> *Should we install `react-router-dom` and migrate to URL-based routing, or would you prefer preserving the current state-based screen switching and just create a logical `ProtectedRoute` component that intercepts state-based renders?* (I will plan with state-based routing interception if React router isn't strictly requested to minimize disruption, but please let me know if you want full routing changes!)

> [!WARNING]
> You will need to provide your actual Firebase configuration keys via `.env` variables after this implementation to make it function correctly. I will scaffold an `.env.example` file for you.

## Proposed Changes

### Configuration and Root Setup

#### [NEW] [firebase.js](file:///c:/Projects/xsplit/src/firebase/firebase.js)
Initialize the Firebase v9 app, configure `Auth` and `Firestore`, and export the `auth` and `db` objects for global consumption.

#### [NEW] [firestore.rules](file:///c:/Projects/xsplit/firestore.rules)
Setup the Firestore security configuration that enforces that only authenticated users can access the database, and only leaders can perform admin actions.

#### [MODIFY] [.env.example](file:///c:/Projects/xsplit/.env.example)
Add the `VITE_FIREBASE_*` environment variable placeholders.

---

### Authentication Layer

#### [NEW] [AuthContext.jsx](file:///c:/Projects/xsplit/src/context/AuthContext.jsx)
We will manage the global User and global auth-status using Context, fulfilling the "Store user in global state (Context or Redux)" requirement. It implements `onAuthStateChanged`.

#### [NEW] [authService.js](file:///c:/Projects/xsplit/src/services/authService.js)
Implement the requested abstract functions: `signUp(name, email, password)`, `login(email, password)`, `logout()`, and `getCurrentUser()`. This file will handle the direct Firebase interactions, setting up the `users` collection document upon signup.

---

### UI and Components

#### [NEW] [ProtectedRoute.jsx](file:///c:/Projects/xsplit/src/components/ProtectedRoute.jsx)
A wrapper component that checks the global auth state. If `currentUser` is null and loading is false, it redirects to the authentication page. 

#### [MODIFY] [AuthScreen.jsx](file:///c:/Projects/xsplit/src/screens/AuthScreen.jsx)
Update the login/signup form to:
- Use the actual `login` and `signUp` functions from `authService`.
- Add local error handling (invalid credentials, user not found).
- Add loading UX (disabling buttons while logging in/registering).
- Ask for user `Name` only during the Signup flow as per instructions.

#### [MODIFY] [Navbar.jsx](file:///c:/Projects/xsplit/src/components/Navbar.jsx)
It already accepts `userName`. We will tweak it if necessary to pull directly from global user context or ensure it binds perfectly with the new user object structure coming from Firestore.

---

### Application Core

#### [MODIFY] [App.jsx](file:///c:/Projects/xsplit/src/App.jsx)
- Wrap the app with `<AuthProvider>`.
- Remove the mocked login handlers and local `currentUser` state.
- Replace manual screen conditionals acting as routes with our new `<ProtectedRoute>` components wrapping the screens. 
- Map `leaderId = auth.currentUser.uid` logic whenever we stub new groups or handle database writes (we'll implement basic stubs for group actions to use the real userID).

## Open Questions
- Do you already have a Firebase project created with Firestore database and Email/Password Sign-In toggled ON, or do you need assistance wrapping that up via UI later?
- Would you prefer we install `react-router-dom` for true URLs (e.g. `/login`, `/dashboard`) instead of your current state-based approach? (I am assuming we will stick to your current state-based routing).

## Verification Plan
### Automated Tests
- I'll run local Vite checks using terminal processes to ensure `App` mounts correctly after context wiring.
### Manual Verification
- We will boot the server via `npm run dev`. I'll ask you to plug in real Firebase credentials locally and try to log in, register, and ensure user tokens are persisted after page refresh! 
