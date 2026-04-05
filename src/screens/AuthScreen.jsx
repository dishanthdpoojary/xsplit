import React, { useState } from 'react'
import { signUp, login } from '../services/authService'

function AuthScreen() {
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Wraps a promise with a timeout so the button never hangs forever
  const withTimeout = (promise, ms = 15000) =>
    Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out. Check your internet connection and try again.')), ms)
      ),
    ])

  const getFriendlyError = (err) => {
    switch (err.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Incorrect email or password.'
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up first.'
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Try logging in.'
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.'
      case 'auth/invalid-email':
        return 'Please enter a valid email address.'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please wait a minute and try again.'
      case 'auth/operation-not-allowed':
        return 'Email/Password sign-in is not enabled. Please enable it in your Firebase Console → Authentication → Sign-in methods.'
      case 'auth/network-request-failed':
        return 'Network error. Check your internet connection.'
      default:
        return err.message || 'Authentication failed. Please try again.'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (isSignup && password !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    if (isSignup && !name.trim()) {
      setError('Name is required for signup')
      return
    }

    try {
      setIsLoading(true)
      if (isSignup) {
        await withTimeout(signUp(name, email, password))
      } else {
        await withTimeout(login(email, password))
      }
      // AuthContext's onAuthStateChanged will automatically redirect on success
    } catch (err) {
      console.error('[Auth Error]', err)
      setError(getFriendlyError(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Auth Card */}
      <div className="relative w-full max-w-md">
        <div className="card-elevated p-8 sm:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
              <span className="text-3xl">💰</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              XSplit
            </h1>
            <p className="text-slate-400 text-sm">
              {isSignup 
                ? 'Create your account and start splitting expenses' 
                : 'Welcome back! Sign in to manage your finances'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-warning text-sm text-center">
                {error}
              </div>
            )}

            {isSignup && (
              <div className="form-group">
                <label htmlFor="auth-name" className="form-label">Full Name</label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="form-input"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="auth-email" className="form-label">Email Address</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="auth-password" className="form-label">Password</label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>

            {isSignup && (
              <div className="form-group">
                <label htmlFor="auth-confirm-password" className="form-label">Confirm Password</label>
                <input
                  id="auth-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  required
                />
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 mt-6 disabled:opacity-50">
              {isLoading ? 'Processing...' : (isSignup ? '✍️ Sign Up' : '🔓 Sign In')}
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-6" />

          {/* Toggle */}
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-3">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              onClick={() => {
                setIsSignup(!isSignup)
                setName('')
                setEmail('')
                setPassword('')
                setConfirmPassword('')
                setError(null)
              }}
              className="text-primary font-semibold hover:text-secondary transition-colors duration-200 text-sm"
              type="button"
            >
              {isSignup ? '← Sign in instead' : 'Create new account →'}
            </button>
          </div>
        </div>

        {/* Feedback for demo */}
        <div className="mt-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center">
          <p className="text-xs text-slate-400 mb-2">Demo Mode - Use any email and password</p>
          <p className="text-xs text-slate-500">Example: john@example.com / password</p>
        </div>
      </div>
    </div>
  )
}

export default AuthScreen
