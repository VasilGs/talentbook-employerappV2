// src/App.tsx
import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

// Auth & types
import { supabase, type User } from './lib/supabase'
import { url } from './lib/url'

// Employer-specific views
import { CompanyProfileView } from './components/CompanyProfileView'
import { CompanyProfileCompletion } from './components/CompanyProfileCompletion'

// Global modals
import { SignupModal } from './components/signup-modal'
import { LoginModal } from './components/login-modal'
import { PrivacyTermsModal } from './components/PrivacyTermsModal'

/** Signup data shape used by the completion screen (same as main app) */
interface SignupData {
  name: string
  email: string
  password: string
  userType: 'job_seeker' | 'company'
}

/** Companies table shape (aligned with main app) */
interface CompanyData {
  id: string
  company_name: string
  company_logo: string | null
  industry: string | null
  website_link: string | null
  short_introduction: string | null
  mol_name: string | null
  uic_company_id: string | null
  address: string | null
  phone_number: string | null
  contact_email: string | null
  responsible_person_name: string | null
  number_of_employees: number | null
  subscription_package: string | null
  created_at: string
  updated_at: string
}

export default function App() {
  // Auth & loading
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Company data & flow control
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [userProfileComplete, setUserProfileComplete] = useState(false)
  const [currentPage, setCurrentPage] = useState<'company-dashboard' | 'complete-profile'>('company-dashboard')

  // Completion flow (carried over from main app)
  const [tempSignupData, setTempSignupData] = useState<SignupData | null>(null)

  // Modals
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isPrivacyTermsModalOpen, setIsPrivacyTermsModalOpen] = useState(false)

  // ---- Helpers ----
  const checkCompanyProfile = async (u: User) => {
    try {
      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', u.id)
        .maybeSingle()

      if (error || !company) {
        // No company row yet → force completion screen
        setCompanyData(null)
        setUserProfileComplete(false)
        setCurrentPage('complete-profile')

        // prepare minimal signup payload so CompanyProfileCompletion can render
        setTempSignupData({
          name: u.user_metadata?.full_name || '',
          email: u.email ?? '',
          password: '', // already authenticated; not used in completion
          userType: 'company',
        })
      } else {
        setCompanyData(company)
        setUserProfileComplete(true)
        setCurrentPage('company-dashboard')
      }
    } catch (err) {
      console.error('Error checking company profile:', err)
      setUserProfileComplete(false)
      setCompanyData(null)
      setCurrentPage('complete-profile')
    }
  }

  const handleProfileComplete = () => {
    setUserProfileComplete(true)
    setCurrentPage('company-dashboard')
    setTempSignupData(null)
    // refresh company data
    if (user) checkCompanyProfile(user)
  }

  const handleCompanyProfileUpdate = () => {
    if (user) checkCompanyProfile(user)
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      console.warn('Sign out (local session cleared) error:', e)
    }
  }

  const handleContinueSignup = (signupData: SignupData) => {
    // If you use a separate employer sign up modal in this app,
    // keep this so it routes to completion immediately after.
    setTempSignupData(signupData)
    setIsSignupModalOpen(false)
    setCurrentPage('complete-profile')
  }

  // ---- Auth bootstrap (matches main app timing/feel) ----
  useEffect(() => {
    const startTime = Date.now()
    const minLoadingTime = 2500 // keep the branded loader smooth

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const elapsed = Date.now() - startTime
      const remain = Math.max(0, minLoadingTime - elapsed)

      setTimeout(async () => {
        setUser(session?.user ?? null)

        if (session?.user) {
          // This is the employer app → go straight to dashboard
          setCurrentPage('company-dashboard')
          await checkCompanyProfile(session.user)
        } else {
          // No session → prompt login immediately
          setIsLoginModalOpen(true)
          setCurrentPage('company-dashboard') // keep target view consistent post-login
        }

        setLoading(false)
      }, remain)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        setLoading(true)
        const min = 2500

        setTimeout(async () => {
          setUser(session?.user ?? null)

          if (session?.user) {
            setIsLoginModalOpen(false)
            setIsSignupModalOpen(false)
            setCurrentPage('company-dashboard')
            await checkCompanyProfile(session.user)
          } else {
            setUserProfileComplete(false)
            setCompanyData(null)
            setTempSignupData(null)
            setCurrentPage('company-dashboard')
            setIsLoginModalOpen(true)
          }

          setLoading(false)
        }, min)
      } else {
        // immediate updates for other events
        setUser(session?.user ?? null)
        if (session?.user) {
          setCurrentPage('company-dashboard')
          checkCompanyProfile(session.user)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // ---- Loading screen ----
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center relative">
        <div className="text-center">
          <div className="mb-8">
            <img
              src={url('talent_book_logo_draft_3 copy copy.png')}
              alt="TalentBook Logo"
              className="h-16 w-auto mx-auto object-contain"
            />
          </div>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Loader2 className="w-6 h-6 text-[#FFC107] animate-spin" />
            <span className="text-white text-lg font-medium">Loading TalentBook…</span>
          </div>
          <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-red-600 to-[#FFC107] rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFC107]/5 rounded-full blur-3xl animate-pulse-slow" />
        </div>
      </div>
    )
  }

  // ---- Main (dashboard-first) ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Minimal header for employer app */}
      <header className="relative z-10 border-b border-white/10">
        <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <img
              src={url('talent_book_logo_draft_3 copy copy.png')}
              alt="TalentBook Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-white/80 font-medium">Company Dashboard</span>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-300 text-sm hidden sm:inline">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-red-600/25"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Log In
                </button>
                <button
                  onClick={() => setIsSignupModalOpen(true)}
                  className="bg-[#FFC107] hover:bg-[#FFB300] text-black px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#FFC107]/25"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Route: completion (when company row missing) */}
      {currentPage === 'complete-profile' && tempSignupData && (
        <CompanyProfileCompletion
          signupData={tempSignupData}
          onProfileComplete={handleProfileComplete}
        />
      )}

      {/* Route: dashboard (company profile exists) */}
      {currentPage === 'company-dashboard' && user && userProfileComplete && companyData && (
        <CompanyProfileView
          company={companyData}
          onUpdateSuccess={handleCompanyProfileUpdate}
          onSignOut={handleSignOut}
        />
      )}

      {/* Fallback when logged in but we couldn't build tempSignupData (rare) */}
      {currentPage === 'complete-profile' && user && !tempSignupData && (
        <div className="max-w-xl mx-auto mt-16 bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-white mb-3">Finish setting up your company</h2>
          <p className="text-gray-300 mb-6">
            We couldn’t find your company profile. Click below to start the quick setup.
          </p>
          <button
            onClick={() => {
              setTempSignupData({
                name: user.user_metadata?.full_name || '',
                email: user.email ?? '',
                password: '',
                userType: 'company',
              })
            }}
            className="bg-[#FFC107] hover:bg-[#FFB300] text-black px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            Start Company Profile
          </button>
        </div>
      )}

      {/* If not logged in, keep a simple prompt (login modal is auto-opened) */}
      {!user && (
        <div className="max-w-xl mx-auto mt-24 text-center px-4">
          <h2 className="text-white text-2xl font-semibold mb-3">Welcome to TalentBook for Employers</h2>
          <p className="text-gray-300 mb-6">Sign in to access your company dashboard.</p>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-[#FFC107] hover:bg-[#FFB300] text-black px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            Log In
          </button>
        </div>
      )}

      {/* Modals */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSwitchToLogin={() => setIsLoginModalOpen(true)}
        onOpenPrivacyTerms={() => setIsPrivacyTermsModalOpen(true)}
        onContinueSignup={handleContinueSignup}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignup={() => setIsSignupModalOpen(true)}
      />

      <PrivacyTermsModal
        isOpen={isPrivacyTermsModalOpen}
        onClose={() => setIsPrivacyTermsModalOpen(false)}
      />
    </div>
  )
}
