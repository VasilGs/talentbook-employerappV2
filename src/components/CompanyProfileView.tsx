import React from 'react'
import { useState } from 'react'
import { 
  Building2, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  Hash, 
  Users, 
  Crown,
  Settings,
  Share2,
  Edit,
  Trash2,
  FileText, // Keep this for "Post New Job"
  Users as UsersIcon, // Alias to avoid conflict with Users from lucide-react
  Award,
  BarChart3,
  Calendar,
  Zap
} from 'lucide-react'
import { CompanyJobPostsModal } from './CompanyJobPostsModal'
import { CompanyProfileEditModal } from './CompanyProfileEditModal'
import { JobPostModal } from './JobPostModal'
import { ApplicationsDashboardModal } from './ApplicationsDashboardModal'
import { ApplicantDetailsModal } from './ApplicantDetailsModal'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { AddOnsModal } from './AddOnsModal'
import { Pricing } from './ui/pricing'
import { Modal } from './ui/modal'
import { ShareProfileModal } from './ShareProfileModal'
import { supabase } from '../lib/supabase'

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

interface CompanyProfileViewProps {
  company: CompanyData
  onUpdateSuccess: () => void
  onSignOut: () => void
}

export function CompanyProfileView({ company, onUpdateSuccess, onSignOut }: CompanyProfileViewProps) {
  const [showJobPostsModal, setShowJobPostsModal] = useState(false)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [showJobPostModal, setShowJobPostModal] = useState(false)
  const [showApplicationsModal, setShowApplicationsModal] = useState(false)
  const [showApplicantDetailsModal, setShowApplicantDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddOnsModal, setShowAddOnsModal] = useState(false)
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [showShareProfileModal, setShowShareProfileModal] = useState(false)
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>('')
  const [selectedApplicantId, setSelectedApplicantId] = useState<string>('')
  
  const getSubscriptionColor = (packageType: string | null) => {
    switch (packageType) {
      case 'premium':
        return 'from-[#FFC107] to-[#FFB300]'
      case 'enterprise':
        return 'from-purple-600 to-purple-700'
      case 'basic':
        return 'from-blue-600 to-blue-700'
      default:
        return 'from-gray-600 to-gray-700'
    }
  }

  const getSubscriptionLabel = (packageType: string | null) => {
    switch (packageType) {
      case 'premium':
        return 'Premium'
      case 'enterprise':
        return 'Enterprise'
      case 'basic':
        return 'Basic'
      default:
        return 'Free'
    }
  }

  const handleJobCreated = () => {
    // Refresh job posts modal if it's open
    if (showJobPostsModal) {
      // The CompanyJobPostsModal will handle its own refresh
    }
  }

  const handleViewApplicant = (applicationId: string, applicantId: string) => {
    setSelectedApplicationId(applicationId)
    setSelectedApplicantId(applicantId)
    setShowApplicationsModal(false)
    setShowApplicantDetailsModal(true)
  }

  const handleCloseApplicantDetails = () => {
    setShowApplicantDetailsModal(false)
    setShowApplicationsModal(true) // Return to applications dashboard
  }

  const handleConfirmDelete = async () => {
    try {
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token || !session?.user?.id) {
        console.error('No valid session found')
        setShowDeleteModal(false)
        await onSignOut()
        return
      }

      // Call the Edge Function to delete the user account
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id
        })
      })

      const result = await response.json()
        
      if (!response.ok && !result.success) {
        console.error('Error deleting account:', result.error)
        // Even if deletion fails, sign out the user
      }

      // Note: In a production app, you would typically call an edge function
      // or backend service to properly delete the user account from auth.users
      // The edge function has been called above to handle the deletion
      
      // Close the modal first
      setShowDeleteModal(false)
      
      // Sign out the user (this will redirect to home page)
      await onSignOut()
    } catch (error) {
      console.error('Error deleting account:', error)
      // Only show error if it's not a "user not found" type error
      const errorMessage = (error as Error).message
      if (!errorMessage.includes('User not found') && !errorMessage.includes('user_not_found')) {
        alert('Error deleting account:\n\n' + errorMessage)
      }
      setShowDeleteModal(false)
      try {
        await supabase.auth.signOut()
      } catch (signOutError) {
        console.log('Sign out error (expected if user already deleted):', signOutError)
      }
      onSignOut()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Company Header */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-[#FFC107]/20 bg-white/10">
                {company.company_logo ? (
                  <img 
                    src={company.company_logo} 
                    alt={`${company.company_name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2 font-poppins">
                    {company.company_name}
                  </h1>
                  {company.industry && (
                    <div className="flex items-center text-gray-300 mb-3">
                      <Building2 className="w-5 h-5 mr-2 text-[#FFC107]" />
                      <span>{company.industry}</span>
                    </div>
                  )}
                  {company.subscription_package && (
                    <div className="flex items-center mb-3">
                      <div className={`bg-gradient-to-r ${getSubscriptionColor(company.subscription_package)} px-3 py-1 rounded-full flex items-center space-x-2`}>
                        <Crown className="w-4 h-4 text-white" />
                        <span className="text-white text-sm font-medium">
                          {getSubscriptionLabel(company.subscription_package)} Plan
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setShowEditProfileModal(true)}
                    className="bg-[#FFC107] hover:bg-[#FFB300] text-black px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#FFC107]/25 flex items-center space-x-2">
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                  <button 
                    onClick={() => setShowShareProfileModal(true)}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-white/20 flex items-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-white/20 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>

              {/* Company Description */}
              {company.short_introduction && (
                <p className="text-gray-300 leading-relaxed mb-6">
                  {company.short_introduction}
                </p>
              )}

              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {company.number_of_employees !== null && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{company.number_of_employees}</p>
                        <p className="text-gray-400 text-sm">Employees</p>
                      </div>
                    </div>
                  </div>
                )}

                {company.website_link && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <a 
                          href={company.website_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white font-semibold hover:text-[#FFC107] transition-colors duration-200 truncate block"
                        >
                          Website
                        </a>
                        <p className="text-gray-400 text-sm">Visit site</p>
                      </div>
                    </div>
                  </div>
                )}

                {company.contact_email && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-semibold truncate">{company.contact_email}</p>
                        <p className="text-gray-400 text-sm">Contact</p>
                      </div>
                    </div>
                  </div>
                )}

                {company.phone_number && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-semibold">{company.phone_number}</p>
                        <p className="text-gray-400 text-sm">Phone</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contact Information */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 font-poppins flex items-center">
              <User className="w-6 h-6 mr-3 text-[#FFC107]" />
              Contact Information
            </h2>
            
            <div className="space-y-4">
              {company.responsible_person_name && (
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FFC107] to-[#FFB300] rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Responsible Person</h3>
                    <p className="text-gray-300">{company.responsible_person_name}</p>
                  </div>
                </div>
              )}

              {company.mol_name && (
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Manager / Legal Representative</h3>
                    <p className="text-gray-300">{company.mol_name}</p>
                  </div>
                </div>
              )}

              {company.address && (
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Address</h3>
                    <p className="text-gray-300 leading-relaxed">{company.address}</p>
                  </div>
                </div>
              )}

              {company.uic_company_id && (
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Company ID</h3>
                    <p className="text-gray-300">{company.uic_company_id}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Company Stats */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 font-poppins flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-[#FFC107]" />
              Company Statistics
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600/20 to-blue-700/20 rounded-xl p-6 border border-blue-600/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Active Job Posts</h3>
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-blue-400">12</p>
                <p className="text-blue-300 text-sm">Currently hiring</p>
              </div>

              <div className="bg-gradient-to-r from-green-600/20 to-green-700/20 rounded-xl p-6 border border-green-600/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Applications Received</h3>
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center"> {/* Changed from Users to UsersIcon */}
                    <UsersIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-400">247</p>
                <p className="text-green-300 text-sm">This month</p>
              </div>

              <div className="bg-gradient-to-r from-[#FFC107]/20 to-[#FFB300]/20 rounded-xl p-6 border border-[#FFC107]/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Profile Views</h3>
                  <div className="w-8 h-8 bg-[#FFC107] rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-[#FFC107]">1,234</p>
                <p className="text-[#FFB300] text-sm">This month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Post New Job */}
          <button 
            onClick={() => setShowJobPostModal(true)}
            className="bg-gradient-to-br from-white/10 to-white/5 hover:from-[#FFC107]/20 hover:to-[#FFB300]/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-[#FFC107]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#FFC107]/10 hover:-translate-y-1 group"
          >
            <div className="flex items-center space-x-4"> {/* Changed from FileText to Briefcase */}
              <div className="w-14 h-14 bg-gradient-to-br from-[#FFC107] to-[#FFB300] rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-[#FFC107]/30">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold text-lg group-hover:text-[#FFC107] transition-colors duration-300">Post New Job</h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">Create job listing</p>
              </div>
            </div>
          </button>

          {/* Manage Jobs */}
          <button 
            onClick={() => setShowJobPostsModal(true)}
            className="bg-gradient-to-br from-white/10 to-white/5 hover:from-blue-600/20 hover:to-blue-700/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/10 hover:-translate-y-1 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-blue-600/30">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors duration-300">View All Job Posts</h3> {/* Changed from Manage Jobs */}
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">Manage & track posts</p>
              </div>
            </div>
          </button>

          {/* View Applications */}
          <button 
            onClick={() => setShowApplicationsModal(true)}
            className="bg-gradient-to-br from-white/10 to-white/5 hover:from-green-600/20 hover:to-green-700/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-600/10 hover:-translate-y-1 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-green-600/30"> {/* Changed from Users to UsersIcon */}
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold text-lg group-hover:text-green-400 transition-colors duration-300">Applications</h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">Review candidates</p>
              </div>
            </div>
          </button>

          {/* Analytics */}

          {/* Upgrade Plan */}
          <button 
            onClick={() => setShowPricingModal(true)}
            className="bg-gradient-to-br from-white/10 to-white/5 hover:from-orange-600/20 hover:to-orange-700/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-600/10 hover:-translate-y-1 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-orange-600/30">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold text-lg group-hover:text-orange-400 transition-colors duration-300">Upgrade Plan</h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">Get more features</p>
              </div>
            </div>
          </button>

          {/* Add-ons */}
          <button 
            onClick={() => setShowAddOnsModal(true)}
            className="bg-gradient-to-br from-white/10 to-white/5 hover:from-[#FFC107]/20 hover:to-[#FFB300]/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-[#FFC107]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#FFC107]/10 hover:-translate-y-1 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FFC107] to-[#FFB300] rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-[#FFC107]/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold text-lg group-hover:text-[#FFC107] transition-colors duration-300">Add-ons</h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">Premium features</p>
              </div>
            </div>
          </button>

          {/* Delete Profile */}
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="bg-gradient-to-br from-red-600/15 to-red-700/10 hover:from-red-600/30 hover:to-red-700/20 backdrop-blur-sm rounded-2xl p-6 border border-red-600/40 hover:border-red-500/70 transition-all duration-300 hover:shadow-xl hover:shadow-red-600/20 hover:-translate-y-1 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-red-600/40">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-red-400 font-semibold text-lg group-hover:text-red-300 transition-colors duration-300">Delete Profile</h3>
                <p className="text-red-400/70 text-sm group-hover:text-red-300/80 transition-colors duration-300">Permanent action</p>
              </div>
            </div>
          </button>
        </div>

        {/* Account Created */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              Company profile created on {new Date(company.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Job Posts Modal */}
      <CompanyJobPostsModal
        isOpen={showJobPostsModal}
        onClose={() => setShowJobPostsModal(false)}
        companyUserId={company.user_id || ''}
      />

      {/* Edit Profile Modal */}
      {showEditProfileModal && <CompanyProfileEditModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        companyData={company}
        onUpdateSuccess={onUpdateSuccess}
      />}

      {/* Job Post Modal */}
      <JobPostModal
        isOpen={showJobPostModal}
        onClose={() => setShowJobPostModal(false)}
        companyUserId={company.user_id || ''}
        companyName={company.company_name}
        onJobCreated={handleJobCreated}
      />

      {/* Applications Dashboard Modal */}
      <ApplicationsDashboardModal
        isOpen={showApplicationsModal}
        onClose={() => setShowApplicationsModal(false)}
        companyUserId={company.user_id || ''}
        onViewApplicant={handleViewApplicant}
      />

      {/* Applicant Details Modal */}
      <ApplicantDetailsModal
        isOpen={showApplicantDetailsModal}
        onClose={handleCloseApplicantDetails}
        applicationId={selectedApplicationId}
        applicantId={selectedApplicantId}
      />

      {/* Add-ons Modal */}
      <AddOnsModal
        isOpen={showAddOnsModal}
        onClose={() => setShowAddOnsModal(false)}
      />

      {/* Pricing Modal */}
      <Modal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)} 
        className="bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800 border border-white/20 max-w-7xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8">
          <Pricing 
            plans={[]}
            title="Choose Your Plan"
            description="Upgrade to unlock more features and grow your hiring capabilities"
          />
        </div>
      </Modal>

      {/* Share Profile Modal */}
      <ShareProfileModal
        isOpen={showShareProfileModal}
        onClose={() => setShowShareProfileModal(false)}
        profileId={company.id}
        profileName={company.company_name}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        userType="company"
      />
    </div>
  )
}