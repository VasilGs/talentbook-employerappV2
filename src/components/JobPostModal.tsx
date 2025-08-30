import React, { useState } from 'react'
import { Modal } from './ui/modal'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  GraduationCap,
  Gift,
  Loader2,
  X,
  Plus
} from 'lucide-react'
import { supabase } from '../lib/supabase'

interface JobPostModalProps {
  isOpen: boolean
  onClose: () => void
  companyUserId: string
  companyName: string
  onJobCreated?: () => void
}

export function JobPostModal({ isOpen, onClose, companyUserId, companyName, onJobCreated }: JobPostModalProps) {
  const [formData, setFormData] = useState({
    jobTitle: '',
    shortDescription: '',
    industry: '',
    location: '',
    isRemote: false,
    jobType: '',
    applicationDeadline: '',
    experienceLevel: '',
    skills: '',
    educationLevel: '',
    salary: '',
    benefits: '',
    requiredDocuments: '',
    applicationLink: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const jobTypes = [
    'Full-time',
    'Part-time', 
    'Contract',
    'Internship',
    'Freelance'
  ]

  const experienceLevels = [
    'Entry-level',
    'Mid-level',
    'Senior',
    'Executive'
  ]

  const educationLevels = [
    'No specific requirement',
    'High School',
    'Associate\'s Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD'
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      skills: e.target.value
    }))
  }

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      shortDescription: '',
      industry: '',
      location: '',
      isRemote: false,
      jobType: '',
      applicationDeadline: '',
      experienceLevel: '',
      skills: '',
      educationLevel: '',
      salary: '',
      benefits: '',
      requiredDocuments: '',
      applicationLink: ''
    })
    setError(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Process skills into array
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0)

      // Prepare job post data
      const jobPostData = {
        user_id: companyUserId,
        company_name: companyName,
        position: formData.jobTitle,
        short_description: formData.shortDescription,
        location: formData.location,
        is_remote: formData.isRemote,
        job_type: formData.jobType || null,
        experience_level: formData.experienceLevel || null,
        skills: skillsArray.length > 0 ? skillsArray : null,
        salary: formData.salary || null,
        application_link: formData.applicationLink || null,
        application_deadline: formData.applicationDeadline || null,
        education_level: formData.educationLevel || null,
        benefits: formData.benefits || null,
        required_documents: formData.requiredDocuments || null,
        status: 'active'
      }

      const { error: insertError } = await supabase
        .from('job_posts')
        .insert(jobPostData)

      if (insertError) {
        throw insertError
      }

      // Success - close modal and refresh job posts
      handleClose()
      if (onJobCreated) {
        onJobCreated()
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the job post.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      className="bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800 border border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFC107] to-[#FFB300] rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-poppins">
                Post New Job
              </h2>
              <p className="text-gray-300">
                Create a new job listing for {companyName}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Job Information */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-[#FFC107]" />
              Job Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job Title */}
              <div className="md:col-span-2">
                <Label htmlFor="jobTitle" className="block text-sm font-medium text-gray-300 mb-2">
                  Job Title *
                </Label>
                <input
                  type="text"
                  id="jobTitle"
                  required
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              {/* Industry */}
              <div>
                <Label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-2">
                  Industry
                </Label>
                <input
                  type="text"
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="e.g. Technology, Healthcare"
                />
              </div>

              {/* Job Type */}
              <div>
                <Label htmlFor="jobType" className="block text-sm font-medium text-gray-300 mb-2">
                  Employment Type *
                </Label>
                <select
                  id="jobType"
                  required
                  value={formData.jobType}
                  onChange={(e) => handleInputChange('jobType', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent transition-all duration-200 text-white"
                >
                  <option value="" className="bg-neutral-800">Select employment type</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type} className="bg-neutral-800">{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Short Description */}
            <div className="mt-4">
              <Label htmlFor="shortDescription" className="block text-sm font-medium text-gray-300 mb-2">
                Short Description *
              </Label>
              <textarea
                id="shortDescription"
                required
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                maxLength={300}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 resize-none"
                placeholder="Brief description of the role and responsibilities..."
              />
              <p className="text-gray-400 text-sm mt-1">
                {formData.shortDescription.length}/300 characters
              </p>
            </div>
          </div>

          {/* Location & Remote */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-[#FFC107]" />
              Location
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div>
                <Label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                  Location *
                </Label>
                <input
                  type="text"
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="e.g. New York, NY or Remote"
                />
              </div>

              {/* Remote Option */}
              <div className="flex items-center space-x-3 mt-8">
                <input
                  type="checkbox"
                  id="isRemote"
                  checked={formData.isRemote}
                  onChange={(e) => handleInputChange('isRemote', e.target.checked)}
                  className="w-4 h-4 text-[#FFC107] bg-white/10 border-white/20 rounded focus:ring-[#FFC107] focus:ring-2"
                />
                <Label htmlFor="isRemote" className="text-sm font-medium text-gray-300">
                  Remote work available
                </Label>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-[#FFC107]" />
              Requirements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Experience Level */}
              <div>
                <Label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-300 mb-2">
                  Experience Level
                </Label>
                <select
                  id="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent transition-all duration-200 text-white"
                >
                  <option value="" className="bg-neutral-800">Select experience level</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level} className="bg-neutral-800">{level}</option>
                  ))}
                </select>
              </div>

              {/* Education Level */}
              <div>
                <Label htmlFor="educationLevel" className="block text-sm font-medium text-gray-300 mb-2">
                  Education Level
                </Label>
                <select
                  id="educationLevel"
                  value={formData.educationLevel}
                  onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent transition-all duration-200 text-white"
                >
                  <option value="" className="bg-neutral-800">Select education level</option>
                  {educationLevels.map(level => (
                    <option key={level} value={level} className="bg-neutral-800">{level}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-4">
              <Label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-2">
                Required Skills
              </Label>
              <input
                type="text"
                id="skills"
                value={formData.skills}
                onChange={handleSkillsChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                placeholder="e.g. JavaScript, React, Node.js (separate with commas)"
              />
              <p className="text-gray-400 text-sm mt-1">
                Separate skills with commas
              </p>
            </div>

            {/* Required Documents */}
            <div className="mt-4">
              <Label htmlFor="requiredDocuments" className="block text-sm font-medium text-gray-300 mb-2">
                Required Documents
              </Label>
              <textarea
                id="requiredDocuments"
                value={formData.requiredDocuments}
                onChange={(e) => handleInputChange('requiredDocuments', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 resize-none"
                placeholder="e.g. Resume, Cover Letter, Portfolio, References..."
              />
            </div>
          </div>

          {/* Compensation & Benefits */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-[#FFC107]" />
              Compensation & Benefits
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Salary */}
              <div>
                <Label htmlFor="salary" className="block text-sm font-medium text-gray-300 mb-2">
                  Salary Range
                </Label>
                <input
                  type="text"
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="e.g. $80,000 - $120,000 per year"
                />
              </div>

              {/* Application Deadline */}
              <div>
                <Label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-300 mb-2">
                  Application Deadline
                </Label>
                <input
                  type="date"
                  id="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent transition-all duration-200 text-white"
                />
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-4">
              <Label htmlFor="benefits" className="block text-sm font-medium text-gray-300 mb-2">
                Additional Benefits
              </Label>
              <textarea
                id="benefits"
                value={formData.benefits}
                onChange={(e) => handleInputChange('benefits', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 resize-none"
                placeholder="e.g. Health insurance, 401k matching, flexible hours, remote work, professional development..."
              />
            </div>
          </div>

          {/* Application Details */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-[#FFC107]" />
              Application Details
            </h3>

            {/* Application Link */}
            <div>
              <Label htmlFor="applicationLink" className="block text-sm font-medium text-gray-300 mb-2">
                Application Link
              </Label>
              <input
                type="url"
                id="applicationLink"
                value={formData.applicationLink}
                onChange={(e) => handleInputChange('applicationLink', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                placeholder="https://company.com/careers/apply"
              />
              <p className="text-gray-400 text-sm mt-1">
                Where candidates should apply for this position
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={handleClose}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium border border-white/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#FFC107] hover:bg-[#FFB300] text-black px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#FFC107]/25 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Job Post...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Post Job</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}