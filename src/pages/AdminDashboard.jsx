import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobs, moderateJob } from '../redux/slices/jobSlice'
import { fetchApplications } from '../redux/slices/applicationSlice'
import { toast } from 'react-hot-toast'
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Shield, CheckCircle, XCircle, Users, Briefcase, FileCheck, TrendingUp } from 'lucide-react'
import API from '../services/api'

function AdminDashboard() {
  const dispatch = useDispatch()
  
  const { jobs } = useSelector((state) => state.jobs)
  const { applications } = useSelector((state) => state.applications)
  
  const [usersList, setUsersList] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [activeTab, setActiveTab] = useState('moderation') // 'moderation', 'users', 'analytics'

  useEffect(() => {
    dispatch(fetchJobs())
    dispatch(fetchApplications())
    fetchUsers()
  }, [dispatch])

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      // In a real environment, we'd have a get all users API.
      // We will define an endpoint or mock it based on seed data.
      // Let's call /api/auth/me to verify we are admin, and then fetch users or fallback.
      const response = await API.get('/api/applications') // returns all for admin
      // Since applications lists user references, let's build contact lists.
      // For fallback user display, we populate mock admins/recruiters/students.
      setUsersList([
        { id: 1, name: 'Sarah Jenkins', email: 'student@careergenie.com', role: 'student', date: '2026-05-15' },
        { id: 2, name: 'Google Recruiter', email: 'recruiter@careergenie.com', role: 'recruiter', date: '2026-05-14' },
        { id: 3, name: 'System Admin', email: 'admin@careergenie.com', role: 'admin', date: '2026-05-10' }
      ])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleModerate = async (jobId, status) => {
    try {
      await dispatch(moderateJob({ id: jobId, status })).unwrap()
      toast.success(`Job post status set to "${status}"`)
      dispatch(fetchJobs())
    } catch (err) {
      toast.error(err || "Moderation failed")
    }
  }

  // Analytics Chart Data
  const monthlyData = [
    { name: 'Jan', Applications: 12, Hires: 2 },
    { name: 'Feb', Applications: 25, Hires: 5 },
    { name: 'Mar', Applications: 42, Hires: 9 },
    { name: 'Apr', Applications: 55, Hires: 14 },
    { name: 'May', Applications: 75, Hires: 22 },
    { name: 'Jun', Applications: 98, Hires: 31 }
  ]

  const topSkillsData = [
    { name: 'React.js', count: 48 },
    { name: 'JavaScript', count: 42 },
    { name: 'Python', count: 35 },
    { name: 'Node.js', count: 31 },
    { name: 'SQL', count: 24 },
    { name: 'Git', count: 20 }
  ]

  // Filter pending jobs for moderation
  const pendingJobs = jobs.filter(j => j.status === 'pending')

  // Stats Counters
  const totalJobs = jobs.length
  const activeJobs = jobs.filter(j => j.status === 'approved').length
  const studentCount = usersList.filter(u => u.role === 'student').length
  const recruiterCount = usersList.filter(u => u.role === 'recruiter').length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header banner */}
      <div className="glass rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary dark:text-blue-400" />
            Admin Control Panel
          </h1>
          <p className="text-xs text-slate-400 mt-1">Approve job postings, moderate platforms, inspect growth charts, and manage system roles.</p>
        </div>
      </div>

      {/* Grid overview count indicators */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass rounded-xl p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Users</span>
            <h3 className="text-xl font-bold mt-0.5">{usersList.length} Accounts</h3>
          </div>
        </div>

        <div className="glass rounded-xl p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Moderated Jobs</span>
            <h3 className="text-xl font-bold mt-0.5">{totalJobs} Posted</h3>
          </div>
        </div>

        <div className="glass rounded-xl p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
            <FileCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Approved Jobs</span>
            <h3 className="text-xl font-bold mt-0.5">{activeJobs} Active</h3>
          </div>
        </div>

        <div className="glass rounded-xl p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Applications</span>
            <h3 className="text-xl font-bold mt-0.5">{applications.length} Submissions</h3>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'moderation' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Pending Approvals ({pendingJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Moderate Users ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Platform Analytics
        </button>
      </div>

      {/* Tab content: Moderation approvals list */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          {pendingJobs.map((job) => (
            <div key={job._id} className="glass rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{job.title}</h3>
                  <span className="rounded bg-warning/10 px-2 py-0.5 text-[9px] font-bold text-warning uppercase">Pending</span>
                </div>
                <p className="text-xs text-slate-400">{job.company} • {job.location}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 max-w-xl">{job.description}</p>
              </div>

              <div className="flex gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => handleModerate(job._id, 'approved')}
                  className="rounded-lg bg-success px-4 py-2 text-xs font-bold text-white shadow hover:opacity-95 flex items-center gap-1"
                >
                  <CheckCircle className="h-4 w-4" /> Approve
                </button>
                <button
                  onClick={() => handleModerate(job._id, 'rejected')}
                  className="rounded-lg bg-danger px-4 py-2 text-xs font-bold text-white shadow hover:opacity-95 flex items-center gap-1"
                >
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              </div>
            </div>
          ))}

          {pendingJobs.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-10 italic">No job postings are pending moderation checks.</p>
          )}
        </div>
      )}

      {/* Tab content: Users list */}
      {activeTab === 'users' && (
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Date Joined</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((usr) => (
                <tr key={usr.id} className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-250">{usr.name}</td>
                  <td className="p-4 text-slate-500">{usr.email}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                      usr.role === 'admin' ? 'bg-danger/10 text-danger' : usr.role === 'recruiter' ? 'bg-primary/10 text-primary dark:bg-blue-400/20' : 'bg-success/10 text-success'
                    }`}>
                      {usr.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{usr.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab content: Analytics module charts */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Applications line chart */}
          <div className="glass rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-sm">Monthly Placement & Submissions</h3>
            <div className="h-64 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="Applications" stroke="#2563EB" fillOpacity={1} fill="url(#colorApps)" />
                  <Area type="monotone" dataKey="Hires" stroke="#22C55E" fillOpacity={1} fill="url(#colorHires)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top skills bar chart */}
          <div className="glass rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-sm">Popular Skills Listed by Students</h3>
            <div className="h-64 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSkillsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

    </div>
  )
}

export default AdminDashboard
