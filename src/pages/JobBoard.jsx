import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobs } from '../redux/slices/jobSlice'
import { Search, MapPin, Briefcase, DollarSign, Calendar, SlidersHorizontal, ArrowUpDown } from 'lucide-react'

function JobBoard() {
  const dispatch = useDispatch()
  const { jobs, loading } = useSelector((state) => state.jobs)
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    skills: '',
    sort: 'newest'
  })

  // Fetch jobs on mount & filter change
  useEffect(() => {
    dispatch(fetchJobs(filters))
  }, [dispatch, filters.sort]) // Fetch instantly on sort, fetch on manual submit for search/filter inputs

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    dispatch(fetchJobs(filters))
  }

  const handleResetFilters = () => {
    const defaultFilters = { search: '', location: '', type: '', skills: '', sort: 'newest' }
    setFilters(defaultFilters)
    dispatch(fetchJobs(defaultFilters))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Explore Opportunities</h1>
          <p className="text-xs text-slate-400 mt-1">Discover jobs and internships matched to your unique skill set.</p>
        </div>
      </div>

      {/* Advanced Search & Filtering form */}
      <div className="glass rounded-xl p-5">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleInputChange}
                placeholder="Job title, keywords, or company"
                className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
              />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <MapPin className="h-4 w-4" />
              </div>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleInputChange}
                placeholder="Location (e.g. Remote, City)"
                className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
              />
            </div>

            {/* Skills Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Briefcase className="h-4 w-4" />
              </div>
              <input
                type="text"
                name="skills"
                value={filters.skills}
                onChange={handleInputChange}
                placeholder="Skills (comma separated, e.g. React)"
                className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
              />
            </div>

            {/* Job Type selection */}
            <div className="relative">
              <select
                name="type"
                value={filters.type}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
              >
                <option value="">All Job Types</option>
                <option value="intern">Internships</option>
                <option value="full-time">Full-Time</option>
                <option value="remote">Remote-only</option>
              </select>
            </div>

          </div>

          {/* Action buttons + sorting */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              {/* Sorting */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-400">Sort by:</span>
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleInputChange}
                  className="rounded-lg border border-slate-200 bg-white py-1 px-2.5 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                >
                  <option value="newest">Newest Opportunities</option>
                  <option value="deadline">Application Deadline</option>
                  {isAuthenticated && user?.role === 'student' && (
                    <option value="match">Highest AI Match %</option>
                  )}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
              >
                Clear
              </button>
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-primary-dark"
              >
                Find Jobs
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Job listings Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div 
              key={job._id} 
              className="glass rounded-xl p-5 flex flex-col justify-between hover:shadow-lg transition-shadow relative overflow-hidden"
            >
              {/* Score badge at top right if student is logged in */}
              {isAuthenticated && user?.role === 'student' && job.matchScore > 0 && (
                <div className={`absolute top-0 right-0 rounded-bl-lg px-3 py-1 text-[10px] font-bold text-white ${job.matchScore >= 80 ? 'bg-success' : job.matchScore >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                  {job.matchScore}% Match
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{job.company}</span>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-1 pr-14">{job.title}</h3>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {job.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 4 && (
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      +{job.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer info */}
              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800/80 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span className="truncate">{job.salary || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-1 col-span-2">
                    <Calendar className="h-3 w-3" />
                    <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="flex-grow rounded-lg bg-primary py-2 text-center text-xs font-bold text-white hover:bg-primary-dark transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <p className="text-slate-400 italic">No job openings found matching your criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default JobBoard
