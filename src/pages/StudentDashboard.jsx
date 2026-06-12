import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser, updateStudentProfile } from '../redux/slices/authSlice'
import { fetchJobs } from '../redux/slices/jobSlice'
import { fetchApplications } from '../redux/slices/applicationSlice'
import { toast } from 'react-hot-toast'
import { FileText, CheckCircle, Clock, Calendar, Plus, X, GraduationCap, Building, Tag, ExternalLink } from 'lucide-react'

function StudentDashboard() {
  const dispatch = useDispatch()
  const { user, profile } = useSelector((state) => state.auth)
  const { jobs } = useSelector((state) => state.jobs)
  const { applications } = useSelector((state) => state.applications)

  const [editProfileMode, setEditProfileMode] = useState(false)
  const [profileForm, setProfileForm] = useState({
    college: '',
    branch: '',
    graduationYear: '',
    skills: []
  })
  const [newSkill, setNewSkill] = useState('')

  // Sync profile details with local state
  useEffect(() => {
    if (profile) {
      setProfileForm({
        college: profile.college || '',
        branch: profile.branch || '',
        graduationYear: profile.graduationYear || '',
        skills: profile.skills || []
      })
    }
  }, [profile])

  // Fetch jobs and applications
  useEffect(() => {
    dispatch(loadUser())
    dispatch(fetchJobs({ sort: 'match' })) // Fetch matches sorted by score
    dispatch(fetchApplications())
  }, [dispatch])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(updateStudentProfile(profileForm)).unwrap()
      toast.success("Profile updated successfully")
      setEditProfileMode(false)
      dispatch(fetchJobs({ sort: 'match' })) // Refresh matches on skill update
    } catch (err) {
      toast.error(err || "Failed to update profile")
    }
  }

  const handleAddSkill = () => {
    if (newSkill && !profileForm.skills.includes(newSkill)) {
      setProfileForm({
        ...profileForm,
        skills: [...profileForm.skills, newSkill]
      })
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setProfileForm({
      ...profileForm,
      skills: profileForm.skills.filter(s => s !== skillToRemove)
    })
  }

  // Calculate upcoming deadlines (next 15 days)
  const upcomingDeadlines = jobs
    .filter(j => j.deadline && new Date(j.deadline) > new Date())
    .slice(0, 3)

  // Status mapping colors
  const statusColors = {
    applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'under review': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    shortlisted: 'bg-warning/20 text-warning dark:bg-amber-950/20',
    'interview scheduled': 'bg-secondary/20 text-secondary dark:bg-cyan-950/20',
    selected: 'bg-success/20 text-success dark:bg-green-950/20',
    rejected: 'bg-danger/20 text-danger dark:bg-red-950/20'
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome banner */}
      <div className="glass rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name || "User"}!</h1>
          <p className="text-xs text-slate-400 mt-1">Here is a quick overview of your resume metrics, job matches, and active applications.</p>
        </div>
        <Link to="/resume" className="rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-primary-dark transition-colors">
          Upload New Resume
        </Link>
      </div>

      {/* Grid summary cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Apps */}
        <div className="glass rounded-xl p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-blue-400/20 dark:text-blue-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Applications</span>
            <h3 className="text-xl font-bold mt-0.5">{applications.length}</h3>
          </div>
        </div>

        {/* Resume Score */}
        <div className="glass rounded-xl p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary dark:bg-cyan-400/20 dark:text-cyan-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Resume Score</span>
            <h3 className="text-xl font-bold mt-0.5">{profile?.resumeScore ? `${profile.resumeScore}%` : 'N/A'}</h3>
          </div>
        </div>

        {/* Matched jobs */}
        <div className="glass rounded-xl p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Top Matches</span>
            <h3 className="text-xl font-bold mt-0.5">{jobs.filter(j => j.matchScore >= 70).length} Jobs</h3>
          </div>
        </div>

        {/* Graduation Year */}
        <div className="glass rounded-xl p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Graduation</span>
            <h3 className="text-xl font-bold mt-0.5">{profile?.graduationYear || 'N/A'}</h3>
          </div>
        </div>
      </div>

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (Profile & Deadlines) */}
        <div className="space-y-8">
          {/* Profile Overview Card */}
          <div className="glass rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="font-bold text-sm">Academic Profile</h3>
              <button
                onClick={() => setEditProfileMode(!editProfileMode)}
                className="text-xs font-semibold text-primary hover:underline dark:text-blue-400"
              >
                {editProfileMode ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editProfileMode ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">College</label>
                  <input
                    type="text"
                    required
                    value={profileForm.college}
                    onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                    className="block w-full rounded-lg border border-slate-200 bg-white/50 py-1.5 px-3 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Branch / Degree</label>
                  <input
                    type="text"
                    required
                    value={profileForm.branch}
                    onChange={(e) => setProfileForm({ ...profileForm, branch: e.target.value })}
                    className="block w-full rounded-lg border border-slate-200 bg-white/50 py-1.5 px-3 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Graduation Year</label>
                  <input
                    type="number"
                    required
                    value={profileForm.graduationYear}
                    onChange={(e) => setProfileForm({ ...profileForm, graduationYear: e.target.value })}
                    className="block w-full rounded-lg border border-slate-200 bg-white/50 py-1.5 px-3 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Skills</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="e.g. React"
                      className="block flex-grow rounded-lg border border-slate-200 bg-white/50 py-1.5 px-3 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="rounded-lg bg-primary/10 p-2 text-primary dark:bg-blue-400/20 dark:text-blue-400"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {profileForm.skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-slate-400 hover:text-danger">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-dark"
                >
                  Save Profile
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{profile?.college || 'Not Specified'}</p>
                    <span className="text-[10px] text-slate-400">College / Institution</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{profile?.branch || 'Not Specified'}</p>
                    <span className="text-[10px] text-slate-400">Branch & Specialization</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">My Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {!profile?.skills || profile.skills.length === 0 ? (
                      <span className="text-slate-400 text-[11px] italic">No skills listed yet</span>
                    ) : (
                      profile.skills.map((skill, index) => (
                        <span key={index} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-semibold text-primary dark:bg-blue-400/20 dark:text-blue-400">
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {profile?.resumeUrl && (
                  <div className="border-t border-slate-100 pt-3 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-semibold text-primary hover:underline dark:text-blue-400"
                    >
                      <FileText className="h-4 w-4" />
                      View Uploaded Resume
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Upcoming deadlines timeline */}
          <div className="glass rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-sm border-b border-slate-100 pb-3 dark:border-slate-800">Upcoming Deadlines</h3>
            <div className="space-y-4 text-xs">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-slate-400 italic">No upcoming application deadlines</p>
              ) : (
                upcomingDeadlines.map((job) => (
                  <div key={job._id} className="relative pl-6 before:absolute before:left-2 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-danger">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{job.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{job.company}</p>
                    <span className="text-[10px] text-danger block mt-1">
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Columns (Recommended Jobs & Recent Applications) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recommended Jobs Feed */}
          <div className="glass rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="font-bold text-sm">Recommended for You</h3>
              <Link to="/jobs" className="text-xs font-semibold text-primary hover:underline dark:text-blue-400">
                Explore Jobs
              </Link>
            </div>

            <div className="space-y-4">
              {jobs.slice(0, 3).map((job) => (
                <div key={job._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-slate-100/50 hover:bg-slate-50/50 dark:border-slate-800/50 dark:hover:bg-slate-800/30 gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{job.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{job.company} • {job.location}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {job.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="rounded bg-slate-100 px-2 py-0.5 text-[9px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Match Indicator Gauge */}
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold ${job.matchScore >= 80 ? 'text-success' : job.matchScore >= 50 ? 'text-warning' : 'text-danger'}`}>
                        {job.matchScore ? `${job.matchScore}%` : '85%'} Match
                      </span>
                    </div>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 dark:bg-blue-400/20 dark:text-blue-400"
                    >
                      Apply
                    </Link>
                  </div>
                </div>
              ))}
              {jobs.filter(j => j.status === 'approved').length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">No recommended jobs found. Upload a resume to trigger AI matching!</p>
              )}
            </div>
          </div>

          {/* Recent Applications Feed */}
          <div className="glass rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="font-bold text-sm">Recent Applications</h3>
              <Link to="/applications" className="text-xs font-semibold text-primary hover:underline dark:text-blue-400">
                View Tracker
              </Link>
            </div>

            <div className="space-y-4">
              {applications.slice(0, 3).map((app) => (
                <div key={app._id} className="flex justify-between items-center p-4 rounded-xl border border-slate-100/50 dark:border-slate-800/50">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{app.jobId?.title || 'Unknown Job'}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{app.jobId?.company || 'Unknown Company'}</p>
                    <span className="text-[10px] text-slate-400 block mt-2">
                      Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${statusColors[app.status] || 'bg-slate-100 text-slate-800'}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
              {applications.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">You haven't applied for any jobs yet. Check the Job Board!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
