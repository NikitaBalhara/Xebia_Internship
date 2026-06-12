import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchApplications } from '../redux/slices/applicationSlice'
import { ChevronRight, Calendar, MessageSquare, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react'

function ApplicationTracker() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { applications, loading } = useSelector((state) => state.applications)

  useEffect(() => {
    dispatch(fetchApplications())
  }, [dispatch])

  // Application pipeline sequence
  const stages = ['applied', 'under review', 'shortlisted', 'interview scheduled', 'selected']

  const getStageIndex = (currentStatus) => {
    if (currentStatus === 'rejected') return -1
    return stages.indexOf(currentStatus)
  }

  const handleRecruiterChat = (recruiterId) => {
    navigate(`/messages?chatWith=${recruiterId}`)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Application Tracker</h1>
        <p className="text-xs text-slate-400 mt-1">Monitor the selection process and interview pipelines of your active applications.</p>
      </div>

      {/* Applications list */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const stageIndex = getStageIndex(app.status)
            const isRejected = app.status === 'rejected'
            const recruiterId = app.jobId?.recruiterId?._id || app.jobId?.recruiterId

            return (
              <div key={app._id} className="glass rounded-2xl p-6 space-y-6">
                
                {/* Header card details */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{app.jobId?.title || 'Unknown Job'}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{app.jobId?.company || 'Unknown Company'} • {app.jobId?.location}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Chat with Recruiter button */}
                    {recruiterId && (
                      <button
                        onClick={() => handleRecruiterChat(recruiterId)}
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                        title="Chat with Hiring Coordinator"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    )}

                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${isRejected ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary dark:bg-blue-400/20 dark:text-blue-400'}`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Visual Timeline Pipeline */}
                <div className="relative pt-2">
                  {isRejected ? (
                    <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-xs font-semibold text-danger dark:bg-red-950/20">
                      <XCircle className="h-5 w-5" />
                      <div>
                        <p>Application Rejected</p>
                        {app.notes && <p className="text-[10px] text-slate-400 font-normal mt-0.5">Recruiter feedback: "{app.notes}"</p>}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 relative">
                      {/* Linear connector line (desktop only) */}
                      <div className="hidden md:block absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 z-0"></div>
                      
                      {stages.map((stage, idx) => {
                        const isCompleted = idx <= stageIndex
                        const isActive = idx === stageIndex

                        return (
                          <div key={idx} className="flex flex-row md:flex-col items-center gap-3 md:gap-2 z-10 w-full md:w-auto">
                            {/* Circle Indicator */}
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                              isCompleted 
                                ? 'bg-primary border-primary text-white dark:bg-blue-400 dark:border-blue-400' 
                                : 'bg-white border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800'
                            } ${isActive ? 'ring-4 ring-primary/20 match-pulse' : ''}`}>
                              {idx + 1}
                            </div>
                            
                            {/* Stage title label */}
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'text-primary dark:text-blue-400' : 'text-slate-400'}`}>
                              {stage}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Sub info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-slate-50 dark:border-slate-800/80 text-[10px] text-slate-400 gap-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                  
                  {app.notes && !isRejected && (
                    <p className="text-slate-500 italic max-w-sm truncate">
                      💡 Status update notes: "{app.notes}"
                    </p>
                  )}
                </div>

              </div>
            )
          })}

          {applications.length === 0 && (
            <div className="py-20 text-center glass rounded-2xl">
              <p className="text-slate-400 italic">No active applications trackable</p>
              <Link to="/jobs" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline dark:text-blue-400">
                Explore Job Board
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export default ApplicationTracker
