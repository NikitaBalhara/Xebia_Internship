import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobById, clearCurrentJob } from '../redux/slices/jobSlice'
import { applyForJob, fetchApplications } from '../redux/slices/applicationSlice'
import { toast } from 'react-hot-toast'
import { MapPin, DollarSign, Calendar, ChevronLeft, Briefcase, CheckCircle2, AlertTriangle, Send } from 'lucide-react'

function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { currentJob, loading: jobLoading } = useSelector((state) => state.jobs)
  const { isAuthenticated, user, profile } = useSelector((state) => state.auth)
  const { applications, loading: applyLoading } = useSelector((state) => state.applications)

  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    dispatch(fetchJobById(id))
    if (isAuthenticated) {
      dispatch(fetchApplications())
    }
    return () => {
      dispatch(clearCurrentJob())
    }
  }, [dispatch, id, isAuthenticated])

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      return navigate(`/login?redirect=jobs/${id}`)
    }
    // ✅ Role check hata diya
    setApplyModalOpen(true)
  }

  const handleApplySubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(applyForJob({ jobId: id, notes })).unwrap()
      toast.success("Application submitted successfully!")
      setApplyModalOpen(false)
      dispatch(fetchApplications())
    } catch (err) {
      toast.error(err || "Failed to submit application")
    }
  }

  const hasApplied = applications.some((app) => app.jobId?._id === id || app.jobId === id)

  if (jobLoading || !currentJob) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">

      <Link to="/jobs" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-primary dark:hover:text-blue-400">
        <ChevronLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <div className="glass rounded-2xl p-6 md:p-8 space-y-6">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{currentJob.company}</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100">{currentJob.title}</h1>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {currentJob.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {currentJob.salary || 'Salary not listed'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Deadline: {new Date(currentJob.deadline).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div>
            {hasApplied ? (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-success/10 px-5 py-3 text-xs font-bold text-success">
                <CheckCircle2 className="h-4 w-4" />
                Applied
              </span>
            ) : (
              <button
                onClick={handleApplyClick}
                className="rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-primary-dark transition-all"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Job Description</h3>
          <p className="whitespace-pre-wrap">{currentJob.description}</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Required Skill Set</h3>
          <div className="flex flex-wrap gap-2">
            {currentJob.skills.map((skill, index) => (
              <span key={index} className="rounded bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>

      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm">Apply for {currentJob.title}</h3>
            <p className="text-xs text-slate-400">Add a note for the recruiter detailing your availability or specific projects.</p>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Cover Note (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell the hiring team why you are a good fit..."
                  rows={4}
                  className="block w-full rounded-lg border border-slate-200 bg-white/50 p-3 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applyLoading}
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-primary-dark transition-all disabled:opacity-70 flex items-center gap-1.5"
                >
                  {applyLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default JobDetails