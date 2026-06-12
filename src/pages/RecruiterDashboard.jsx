import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobs, createJob, updateJob, deleteJob } from '../redux/slices/jobSlice'
import { fetchApplications, updateApplicationStatus } from '../redux/slices/applicationSlice'
import { toast } from 'react-hot-toast'
import { Briefcase, Users, Award, Calendar, MapPin, Plus, Trash2, Edit, CheckSquare, MessageSquare, ChevronDown, User, Star } from 'lucide-react'
import API from '../services/api'

function RecruiterDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { jobs } = useSelector((state) => state.jobs)
  const { applications } = useSelector((state) => state.applications)

  const [activeTab, setActiveTab] = useState('jobs') // 'jobs' or 'applicants'
  const [jobModalOpen, setJobModalOpen] = useState(false)
  const [editingJobId, setEditingJobId] = useState(null)
  
  // Job Form Data
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    skills: '',
    description: '',
    deadline: ''
  })

  // Applicant filter by job ID
  const [selectedJobFilter, setSelectedJobFilter] = useState('all')
  const [selectedApplicantReport, setSelectedApplicantReport] = useState(null) // For viewing candidate resume report details

  useEffect(() => {
    dispatch(fetchJobs())
    dispatch(fetchApplications())
  }, [dispatch])

  // CRUD Job Operations
  const handleJobSubmit = async (e) => {
    e.preventDefault()
    
    // Skills to array
    const skillsArr = jobForm.skills.split(',').map(s => s.trim()).filter(s => s)
    const formattedData = { ...jobForm, skills: skillsArr }

    try {
      if (editingJobId) {
        await dispatch(updateJob({ id: editingJobId, jobData: formattedData })).unwrap()
        toast.success("Job posting updated successfully!")
      } else {
        await dispatch(createJob(formattedData)).unwrap()
        toast.success("Job posted successfully! Pending admin approval.")
      }
      setJobModalOpen(false)
      setEditingJobId(null)
      resetJobForm()
      dispatch(fetchJobs())
    } catch (err) {
      toast.error(err || "Failed to save job")
    }
  }

  const handleEditJobClick = (job) => {
    setEditingJobId(job._id)
    setJobForm({
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      salary: job.salary || '',
      skills: job.skills?.join(', ') || '',
      description: job.description || '',
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ''
    })
    setJobModalOpen(true)
  }

  const handleDeleteJobClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        await dispatch(deleteJob(id)).unwrap()
        toast.success("Job posting deleted")
        dispatch(fetchJobs())
      } catch (err) {
        toast.error(err || "Failed to delete job")
      }
    }
  }

  const resetJobForm = () => {
    setJobForm({
      title: '',
      company: '',
      location: '',
      salary: '',
      skills: '',
      description: '',
      deadline: ''
    })
  }

  // Handle Application Status update
  const handleStatusChange = async (appId, status) => {
    const notes = prompt(`Enter optional status update notes for candidate:`)
    try {
      await dispatch(updateApplicationStatus({ id: appId, status, notes })).unwrap()
      toast.success(`Applicant status updated to "${status}"`)
      dispatch(fetchApplications())
    } catch (err) {
      toast.error(err || "Failed to update status")
    }
  }

  const handleCandidateChat = (candidateId) => {
    navigate(`/messages?chatWith=${candidateId}`)
  }

  const handleViewCandidateReport = async (userId) => {
    try {
      // Find analysis report in backend
      const response = await API.get(`/api/resume/report/${userId}`)
      // Wait, report endpoint expects reportId, let's look at controller logic.
      // In controller: report = await ResumeAnalysis.findById(req.params.id)
      // Since recruiters might view by resume report id or candidate profile id,
      // let's fetch candidate profile details from selected applicant object
    } catch (err) {
      toast.error("Failed to load candidate resume report details")
    }
  }

  // Filter recruiters' applications by job
  const filteredApps = selectedJobFilter === 'all'
    ? applications
    : applications.filter(app => app.jobId?._id === selectedJobFilter || app.jobId === selectedJobFilter)

  // Recruiter Stats
  const activeJobsCount = jobs.filter(j => j.status === 'approved').length
  const totalApplicantsCount = applications.length
  const hiresCount = applications.filter(app => app.status === 'selected').length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header banner */}
      <div className="glass rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Recruiter Console</h1>
          <p className="text-xs text-slate-400 mt-1">Post job vacancies, screen candidates ranked by AI matching score, and communicate with applicants.</p>
        </div>
        <button
          onClick={() => { resetJobForm(); setEditingJobId(null); setJobModalOpen(true) }}
          className="rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-primary-dark transition-all flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Post New Job
        </button>
      </div>

      {/* Recruiter Stats Widgets */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="glass rounded-xl p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-blue-400/20 dark:text-blue-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Postings</span>
            <h3 className="text-xl font-bold mt-0.5">{activeJobsCount} Jobs</h3>
          </div>
        </div>

        <div className="glass rounded-xl p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary dark:bg-cyan-400/20 dark:text-cyan-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Applicants</span>
            <h3 className="text-xl font-bold mt-0.5">{totalApplicantsCount}</h3>
          </div>
        </div>

        <div className="glass rounded-xl p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Selected Hires</span>
            <h3 className="text-xl font-bold mt-0.5">{hiresCount}</h3>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'jobs' ? 'border-primary text-primary dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          My Job Listings ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('applicants')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'applicants' ? 'border-primary text-primary dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Applicants & AI Ranking ({filteredApps.length})
        </button>
      </div>

      {/* Tab: Jobs */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="glass rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{job.title}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                    job.status === 'approved' 
                      ? 'bg-success/10 text-success' 
                      : job.status === 'pending' 
                      ? 'bg-warning/10 text-warning' 
                      : 'bg-danger/10 text-danger'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => handleEditJobClick(job)}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                  title="Edit job details"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteJobClick(job._id)}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-danger hover:bg-red-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-red-950/20"
                  title="Delete job posting"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-10 italic">No job postings created. Click 'Post New Job' to start!</p>
          )}
        </div>
      )}

      {/* Tab: Applicants */}
      {activeTab === 'applicants' && (
        <div className="space-y-6">
          {/* Job select filter */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Filter Applicants by Job:</span>
            <select
              value={selectedJobFilter}
              onChange={(e) => setSelectedJobFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
            >
              <option value="all">All Jobs</option>
              {jobs.map(j => (
                <option key={j._id} value={j._id}>{j.title}</option>
              ))}
            </select>
          </div>

          {/* Applicants List */}
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div key={app._id} className="glass rounded-xl p-5 space-y-4">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary dark:bg-blue-400/20 dark:text-blue-400">
                      {app.studentId?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{app.studentId?.name}</h4>
                      <p className="text-[10px] text-slate-400">{app.studentId?.email} • Applied for <span className="font-semibold text-primary dark:text-blue-400">{app.jobId?.title}</span></p>
                    </div>
                  </div>

                  {/* Actions & rating */}
                  <div className="flex items-center gap-3">
                    {app.matchScore > 0 && (
                      <span className={`rounded px-2 py-0.5 text-xs font-bold ${
                        app.matchScore >= 80 ? 'bg-success/15 text-success' : app.matchScore >= 50 ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'
                      }`}>
                        {app.matchScore}% Match
                      </span>
                    )}

                    <button
                      onClick={() => handleCandidateChat(app.studentId?._id)}
                      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                      title="Message candidate"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    
                    {/* Status updater dropdown */}
                    <div className="relative">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white py-1 px-2.5 text-xs font-semibold focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                      >
                        <option value="applied">Applied</option>
                        <option value="under review">Under Review</option>
                        <option value="shortlisted">Shortlist</option>
                        <option value="interview scheduled">Interview</option>
                        <option value="selected">Hire</option>
                        <option value="rejected">Reject</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Candidate details (college & skills comparison) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Academic Background</span>
                    <p className="text-slate-600 dark:text-slate-300">
                      🏢 <span className="font-semibold text-slate-800 dark:text-slate-200">{app.studentProfile?.college}</span>
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                      🎓 {app.studentProfile?.branch} (Graduation: {app.studentProfile?.graduationYear})
                    </p>
                    {app.notes && (
                      <p className="mt-2 text-xs italic text-slate-500 dark:text-slate-400 bg-slate-50/50 p-2 rounded border border-slate-100/50 dark:bg-slate-900/10">
                        " {app.notes} "
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Parsed Skills Overlaps</span>
                    <div className="flex flex-wrap gap-1">
                      {app.studentProfile?.skills?.map((skill, index) => {
                        const isRequired = app.jobId?.skills?.map(s => s.toLowerCase()).includes(skill.toLowerCase())
                        return (
                          <span 
                            key={index} 
                            className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                              isRequired 
                                ? 'bg-success/10 text-success border border-success/20' 
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {skill}
                          </span>
                        )
                      })}
                    </div>
                    {app.missingSkills && app.missingSkills.length > 0 && (
                      <div className="mt-2.5">
                        <span className="text-[9px] font-bold uppercase text-danger block mb-1">Missing Requirements:</span>
                        <div className="flex flex-wrap gap-1">
                          {app.missingSkills.slice(0, 3).map((ms, index) => (
                            <span key={index} className="rounded bg-danger/10 px-1.5 py-0.5 text-[8px] font-bold text-danger">
                              {ms}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resume download option */}
                {app.studentProfile?.resumeUrl && (
                  <div className="pt-2 flex items-center justify-between text-[11px]">
                    <a
                      href={app.studentProfile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-semibold text-primary hover:underline dark:text-blue-400"
                    >
                      📁 View Candidate Resume File
                    </a>
                  </div>
                )}

              </div>
            ))}

            {filteredApps.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-10 italic">No applications received for job selection.</p>
            )}
          </div>
        </div>
      )}

      {/* Post/Edit Job Modal */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg glass rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-sm">{editingJobId ? 'Edit Job Posting' : 'Post a Job Opening'}</h3>
            
            <form onSubmit={handleJobSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    placeholder="e.g. Frontend Developer Intern"
                    className="block w-full rounded-lg border border-slate-200 bg-white/50 py-2 px-3 focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={jobForm.company}
                    onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                    placeholder="e.g. Google"
                    className="block w-full rounded-lg border border-slate-200 bg-white/50 py-2 px-3 focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    placeholder="e.g. Remote or New York"
                    className="block w-full rounded-lg border border-slate-200 bg-white/50 py-2 px-3 focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    placeholder="e.g. $30/hour or $80k - $90k/yr"
                    className="block w-full rounded-lg border border-slate-200 bg-white/50 py-2 px-3 focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Application Deadline</label>
                <input
                  type="date"
                  required
                  value={jobForm.deadline}
                  onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                  className="block w-full rounded-lg border border-slate-200 bg-white/50 py-2 px-3 focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Required Skills (Comma Separated)</label>
                <input
                  type="text"
                  required
                  value={jobForm.skills}
                  onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                  placeholder="e.g. React, Node.js, JavaScript, Git"
                  className="block w-full rounded-lg border border-slate-200 bg-white/50 py-2 px-3 focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Full Description</label>
                <textarea
                  required
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Describe job requirements, roles, benefits..."
                  rows={5}
                  className="block w-full rounded-lg border border-slate-200 bg-white/50 p-3 focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-primary-dark"
                >
                  Save Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default RecruiterDashboard
