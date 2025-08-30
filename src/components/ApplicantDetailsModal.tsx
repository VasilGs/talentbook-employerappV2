import React, { useState, useEffect } from 'react'
import { Modal } from './ui/modal'
import { Button } from './ui/button'
import { 
  User, 
  Mail, 
  Calendar, 
  Briefcase, 
  FileText, 
  Download, 
  ExternalLink,
  MapPin,
  Clock,
  Building2,
  Award,
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  UserCheck
} from 'lucide-react'
import { supabase } from '../lib/supabase'

interface JobExperience {
  id: string
  company_name: string
  company_website: string | null
  position_name: string
  position_description: string | null
  start_date: string
  end_date: string | null
  created_at: string
}

interface ProfileFile {
  name: string
  url: string
  type: string
}

interface ApplicantProfile {
  id: string
  first_name: string | null
  last_name: string | null
  profile_picture: string | null
  connections: number | null
  description: string | null
  current_job_company: string | null
  current_job_position: string | null
  current_job_start_date: string | null
  current_job_location: string | null
  files: ProfileFile[] | null
  created_at: string
  updated_at: string
}

interface JobApplication {
  id: string
  created_at: string
  status: string
  cover_letter_text: string | null
  job_post: {
    id: string
    position: string
    company_name: string
    location: string
    salary: string | null
  }
}

interface ApplicantDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  applicationId: string
  applicantId: string
}

export function ApplicantDetailsModal({ 
  isOpen, 
  onClose, 
  applicationId, 
  applicantId 
}: ApplicantDetailsModalProps) {
  const [profile, setProfile] = useState<ApplicantProfile | null>(null)
  const [application, setApplication] = useState<JobApplication | null>(null)
  const [experiences, setExperiences] = useState<JobExperience[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // Fetch applicant details when modal opens
  useEffect(() => {
    if (isOpen && applicationId && applicantId) {
      fetchApplicantDetails()
    }
  }, [isOpen, applicationId, applicantId])

  const fetchApplicantDetails = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch application details
      const { data: appData, error: appError } = await supabase
        .from('job_applications')
        .select(`
          id,
          created_at,
          status,
          cover_letter_text,
          job_post:job_posts!inner (
            id,
            position,
            company_name,
            location,
            salary
          )
        `)
        .eq('id', applicationId)
        .single()

      if (appError) throw appError
      setApplication(appData)

      // Fetch profile details
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', applicantId)
        .single()

      if (profileError) throw profileError
      setProfile(profileData)

      // Fetch job experiences
      const { data: expData, error: expError } = await supabase
        .from('job_experiences')
        .select('*')
        .eq('profile_id', applicantId)
        .order('start_date', { ascending: false })

      if (expError) throw expError
      setExperiences(expData || [])

    } catch (err: any) {
      setError(err.message || 'Failed to fetch applicant details')
      console.error('Error fetching applicant details:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (newStatus: string) => {
    if (!application) return

    setUpdatingStatus(true)
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', applicationId)

      if (error) throw error

      setApplication(prev => prev ? { ...prev, status: newStatus } : null)
    } catch (err: any) {
      console.error('Error updating application status:', err)
      // You might want to show a toast notification here
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
      case 'reviewed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40'
      case 'interviewing':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40'
      case 'accepted':
        return 'bg-green-500/20 text-green-400 border-green-500/40'
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/40'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40'
    }
  }

  const getApplicantName = () => {
    if (!profile) return 'Loading...'
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`
    }
    if (profile.first_name) {
      return profile.first_name
    }
    return 'Anonymous Applicant'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatJobDate = (dateString: string) => {
    return new Date(dateString + '-01').toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800 border border-white/20 max-w-4xl">
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-4" />
            <p className="text-white">Loading applicant details...</p>
          </div>
        </div>
      </Modal>
    )
  }

  if (error || !profile || !application) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800 border border-white/20 max-w-4xl">
        <div className="p-8 text-center min-h-[400px] flex items-center justify-center">
          <div>
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Error Loading Details</h3>
            <p className="text-gray-300 mb-4">{error || 'Failed to load applicant details'}</p>
            <Button 
              onClick={fetchApplicantDetails}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Try Again
            </Button>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className="bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800 border border-white/20 max-w-6xl max-h-[90vh] overflow-y-auto"
    >
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div className="w-24 h-24 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
              {profile.profile_picture ? (
                <img 
                  src={profile.profile_picture} 
                  alt={getApplicantName()}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2 font-poppins">
                {getApplicantName()}
              </h2>
              
              {profile.current_job_position && profile.current_job_company && (
                <div className="flex items-center text-gray-300 mb-3">
                  <Briefcase className="w-5 h-5 mr-2 text-[#FFC107]" />
                  <span>{profile.current_job_position} at {profile.current_job_company}</span>
                </div>
              )}

              {profile.connections !== null && (
                <div className="flex items-center text-gray-300 mb-4">
                  <User className="w-5 h-5 mr-2 text-[#FFC107]" />
                  <span>{profile.connections} connections</span>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-2 ${getStatusColor(application.status)}`}>
                  <span className="capitalize">{application.status}</span>
                </span>
                <span className="text-gray-400 text-sm">
                  Applied {formatDate(application.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => updateApplicationStatus('reviewed')}
              disabled={updatingStatus || application.status === 'reviewed'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Mark Reviewed</span>
            </Button>
            <Button
              onClick={() => updateApplicationStatus('interviewing')}
              disabled={updatingStatus || application.status === 'interviewing'}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Interview</span>
            </Button>
            <Button
              onClick={() => updateApplicationStatus('accepted')}
              disabled={updatingStatus || application.status === 'accepted'}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Accept</span>
            </Button>
            <Button
              onClick={() => updateApplicationStatus('rejected')}
              disabled={updatingStatus || application.status === 'rejected'}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </Button>
          </div>
        </div>

        {/* Application Details */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-[#FFC107]" />
            Application for {application.job_post.position}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-gray-300">
              <Building2 className="w-4 h-4 mr-2" />
              <span>{application.job_post.company_name}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{application.job_post.location}</span>
            </div>
            {application.job_post.salary && (
              <div className="flex items-center text-gray-300">
                <span className="w-4 h-4 mr-2">💰</span>
                <span>{application.job_post.salary}</span>
              </div>
            )}
            <div className="flex items-center text-gray-300">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Applied {formatDate(application.created_at)}</span>
            </div>
          </div>

          {application.cover_letter_text && (
            <div className="mt-4">
              <h4 className="text-lg font-medium text-white mb-2">Cover Letter</h4>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {application.cover_letter_text}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="space-y-6">
            {/* About */}
            {profile.description && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-[#FFC107]" />
                  About
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {profile.description}
                </p>
              </div>
            )}

            {/* Current Position */}
            {profile.current_job_position && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-[#FFC107]" />
                  Current Position
                </h3>
                <div className="space-y-2">
                  <p className="text-white font-medium">{profile.current_job_position}</p>
                  {profile.current_job_company && (
                    <p className="text-[#FFC107]">{profile.current_job_company}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    {profile.current_job_start_date && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Since {formatJobDate(profile.current_job_start_date)}</span>
                      </div>
                    )}
                    {profile.current_job_location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{profile.current_job_location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Documents */}
            {profile.files && profile.files.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-[#FFC107]" />
                  Documents
                </h3>
                <div className="space-y-3">
                  {profile.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-[#FFC107]" />
                        <span className="text-white font-medium">{file.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => window.open(file.url, '_blank')}
                          className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View</span>
                        </Button>
                        <Button
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = file.url
                            link.download = file.name
                            link.click()
                          }}
                          className="bg-[#FFC107] hover:bg-[#FFB300] text-black px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Work Experience */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Award className="w-5 h-5 mr-2 text-[#FFC107]" />
              Work Experience
            </h3>
            
            {experiences.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No work experience listed</p>
              </div>
            ) : (
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="border-l-2 border-[#FFC107]/30 pl-6 relative">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-[#FFC107] rounded-full"></div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-white">
                            {exp.position_name}
                          </h4>
                          <p className="text-[#FFC107] font-medium">
                            {exp.company_name}
                          </p>
                          {exp.company_website && (
                            <a 
                              href={exp.company_website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm flex items-center mt-1"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Visit Website
                            </a>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>
                              {formatJobDate(exp.start_date)} - {exp.end_date ? formatJobDate(exp.end_date) : 'Present'}
                            </span>
                          </div>
                        </div>
                      </div>
                      {exp.position_description && (
                        <p className="text-gray-300 leading-relaxed">
                          {exp.position_description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}