import React, { useState, useEffect } from 'react'
import { Modal } from './ui/modal'
import { Button } from './ui/button'
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Briefcase,
  Calendar,
  ExternalLink,
  Loader2
} from 'lucide-react'
import { supabase } from '../lib/supabase'

interface JobPost {
  id: string
  company_name: string
  company_logo: string | null
  position: string
  location: string
  salary: string | null
  job_type: string | null
  experience_level: string | null
  short_description: string | null
  requirements: string | null
  skills: string[] | null
  application_link: string | null
  is_remote: boolean | null
  status: string | null
  application_deadline: string | null
  education_level: string | null
  benefits: string | null
  required_documents: string | null
  created_at: string
  updated_at: string
}

interface CompanyJobPostsModalProps {
  isOpen: boolean
  onClose: () => void
  companyUserId: string
}

export function CompanyJobPostsModal({ isOpen, onClose, companyUserId }: CompanyJobPostsModalProps) {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch job posts when modal opens
  useEffect(() => {
    if (isOpen && companyUserId) {
      fetchJobPosts()
    }
  }, [isOpen, companyUserId])

  const fetchJobPosts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('job_posts')
        .select('*')
        .eq('user_id', companyUserId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setJobPosts(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch job posts')
      console.error('Error fetching job posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/40'
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40'
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
      case 'closed':
        return 'bg-red-500/20 text-red-400 border-red-500/40'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className="bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800 border border-white/20 max-w-4xl max-h-[90vh] overflow-hidden"
    >
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-poppins">
                Job Posts Management
              </h2>
              <p className="text-gray-300">
                Manage all your published job listings
              </p>
            </div>
          </div>
          
          <Button className="bg-[#FFC107] hover:bg-[#FFB300] text-black px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Job Post</span>
          </Button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-[#FFC107] animate-spin mx-auto mb-4" />
                <p className="text-white">Loading job posts...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Error Loading Jobs</h3>
              <p className="text-gray-300 mb-4">{error}</p>
              <Button 
                onClick={fetchJobPosts}
                className="bg-[#FFC107] hover:bg-[#FFB300] text-black px-6 py-2 rounded-lg font-medium"
              >
                Try Again
              </Button>
            </div>
          ) : jobPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Job Posts Yet</h3>
              <p className="text-gray-300 mb-6">
                You haven't published any job posts yet. Create your first job listing to start attracting candidates.
              </p>
              <Button className="bg-[#FFC107] hover:bg-[#FFB300] text-black px-6 py-3 rounded-lg font-semibold">
                Create First Job Post
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobPosts.map((job) => (
                <div 
                  key={job.id} 
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {job.position}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                          {job.status || 'Unknown'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-3">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{job.location}</span>
                          {job.is_remote && <span className="ml-1 text-green-400">(Remote)</span>}
                        </div>
                        
                        {job.salary && (
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span>{job.salary}</span>
                          </div>
                        )}
                        
                        {job.job_type && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{job.job_type}</span>
                          </div>
                        )}
                        
                        {job.experience_level && (
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{job.experience_level}</span>
                          </div>
                        )}
                      </div>

                      {job.short_description && (
                        <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                          {job.short_description}
                        </p>
                      )}

                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-600/40 text-red-300 px-2 py-1 rounded-full text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 3 && (
                            <span className="text-gray-400 text-xs px-2 py-1">
                              +{job.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center text-xs text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Created {formatDate(job.created_at)}</span>
                        {job.updated_at !== job.created_at && (
                          <span className="ml-4">
                            • Updated {formatDate(job.updated_at)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-[#FFC107] hover:bg-[#FFC107]/10 rounded-lg transition-all duration-200">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {job.application_link && (
                        <button 
                          onClick={() => window.open(job.application_link!, '_blank')}
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-all duration-200"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {jobPosts.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing {jobPosts.length} job post{jobPosts.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={fetchJobPosts}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium border border-white/20"
              >
                Refresh
              </Button>
              <Button className="bg-[#FFC107] hover:bg-[#FFB300] text-black px-4 py-2 rounded-lg font-medium">
                Export Data
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}