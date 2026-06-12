import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import API from '../services/api'
import { ArrowRight, FileText, CheckCircle, Search, Activity, Star, ChevronRight, Zap, Target, BookOpen } from 'lucide-react'

function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const [featuredJobs, setFeaturedJobs] = useState([])
  const [activeTip, setActiveTip] = useState(0)

  useEffect(() => {
    // Fetch latest jobs
    const fetchLatest = async () => {
      try {
        const response = await API.get('/api/jobs?sort=newest')
        setFeaturedJobs(response.data.data.slice(0, 3))
      } catch (err) {
        console.error("Error loading featured jobs:", err)
      }
    }
    fetchLatest()
  }, [])

  const tips = [
    {
      title: "Keep it to a Single Page",
      desc: "For college students and entry-level positions, a single page is highly recommended. ATS scanners rank single-page resume structures more reliably."
    },
    {
      title: "Target Keywords from Job Descriptions",
      desc: "ATS algorithms look for exact matches. Align your skill names (e.g., 'ReactJS' vs 'React.js') with the wording in the job description."
    },
    {
      title: "Use Strong Action Verbs",
      desc: "Begin bullet points with verbs like 'Formulated', 'Engineered', 'Orchestrated', or 'Implemented' to demonstrate immediate impact."
    },
    {
      title: "Avoid Heavy Formatting",
      desc: "Use clean section headers. Tables, columns, charts, and graphics can disrupt standard text parsing models."
    }
  ]

  const handleHeroUpload = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=resume')
    } else {
      navigate('/resume')
    }
  }

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary dark:bg-blue-400/20 dark:text-blue-400">
                <Zap className="h-4 w-4 fill-primary stroke-none dark:fill-blue-400" />
                <span>Now Powered by Resume NLP Matching</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Land Your Dream Job with <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AI Guidance</span>
              </h1>

              <p className="mx-auto max-w-lg text-sm text-slate-500 sm:text-base lg:mx-0 dark:text-slate-400">
                CareerGenie grades your resume against industry benchmarks, identifies skill gaps, and matches you instantly to tailored internships and job opportunities.
              </p>

              <div className="flex flex-col gap-3 justify-center sm:flex-row lg:justify-start">
                <button
                  onClick={() => window.location.href = '/analysis'}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-primary-dark transition-all hover:-translate-y-0.5"
                >
                  <FileText className="h-4 w-4" />
                  Analyze My Resume
                </button>
                <Link
                  to="/jobs"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Explore Jobs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Graphic Mockup */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="glass rounded-2xl p-6 shadow-2xl relative z-10">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-sm">Resume Score</h3>
                    <p className="text-[10px] text-slate-400">ATS Assessment Result</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-primary text-xs font-bold text-primary dark:border-blue-400 dark:text-blue-400">
                    84%
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Skills Match</span>
                      <span className="text-secondary">92%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-secondary" style={{ width: '92%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>ATS Keyword Optimization</span>
                      <span className="text-warning">76%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-warning" style={{ width: '76%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800/40">
                  <p className="font-bold text-slate-800 dark:text-slate-200">Suggestions:</p>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">
                    💡 Missing keyword <span className="font-semibold text-primary dark:text-blue-400">"RESTful APIs"</span>. Consider adding it to your projects.
                  </p>
                </div>
              </div>

              {/* Decorative glows */}
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl"></div>
              <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-secondary/20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold sm:text-3xl">Platform Features</h2>
          <p className="text-sm text-slate-400">Everything you need to boost your employment prospects</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass rounded-xl p-6 transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-blue-400/20 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-bold text-sm">Resume Analysis</h3>
            <p className="mt-2 text-xs text-slate-400">Get an instant 0-100 score on layout and visual flow structures.</p>
          </div>

          <div className="glass rounded-xl p-6 transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary dark:bg-cyan-400/20 dark:text-cyan-400">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-bold text-sm">AI Suggestions</h3>
            <p className="mt-2 text-xs text-slate-400">Actionable insights pointing out missing skills and keyword optimizations.</p>
          </div>

          <div className="glass rounded-xl p-6 transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <Star className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-bold text-sm">Job Matching</h3>
            <p className="mt-2 text-xs text-slate-400">Weighted scores showing your exact compatibility percentage for each opening.</p>
          </div>

          <div className="glass rounded-xl p-6 transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-bold text-sm">Application Tracking</h3>
            <p className="mt-2 text-xs text-slate-400">Stage-by-stage pipelines showing your interview status updates in real-time.</p>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Featured Opportunities</h2>
            <p className="text-xs text-slate-400">Latest active jobs posted by premium verified companies</p>
          </div>
          <Link to="/jobs" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline dark:text-blue-400">
            View All Jobs
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredJobs.length === 0 ? (
            // Static Loader cards
            [1, 2, 3].map((num) => (
              <div key={num} className="glass rounded-xl p-5 animate-pulse h-40"></div>
            ))
          ) : (
            featuredJobs.map((job) => (
              <div key={job._id} className="glass rounded-xl p-5 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{job.company}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {job.location}
                    </span>
                  </div>
                  <h3 className="mt-2 font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-1">{job.title}</h3>
                  <p className="mt-2 text-xs text-slate-400 line-clamp-2">{job.description}</p>
                </div>
                <div className="mt-4 border-t border-slate-50 pt-3 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-primary dark:text-blue-400">{job.salary || 'Salary Not Listed'}</span>
                  <Link to={`/jobs/${job._id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-blue-400">
                    Apply
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Resume Tips Expandable */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            AI Career Tips & Guidelines
          </h2>
          <p className="text-sm text-slate-400">Essential rules for passing Applicant Tracking Systems (ATS)</p>
        </div>

        <div className="space-y-4">
          {tips.map((tip, idx) => (
            <div key={idx} className="glass rounded-xl p-5">
              <button
                onClick={() => setActiveTip(activeTip === idx ? -1 : idx)}
                className="flex w-full items-center justify-between text-left text-sm font-bold text-slate-800 dark:text-slate-200"
              >
                <span>{tip.title}</span>
                <span className="text-primary text-lg font-normal">{activeTip === idx ? "−" : "+"}</span>
              </button>
              {activeTip === idx && (
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 pt-2 dark:border-slate-800">
                  {tip.desc}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold">Success Stories</h2>
          <p className="text-xs text-slate-400">Hear from students who landed internships with CareerGenie</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="glass rounded-xl p-6 flex flex-col justify-between">
            <p className="text-xs text-slate-500 italic leading-relaxed dark:text-slate-400">
              "I scanned my resume and got a 62%. The feedback pointed out that I lacked keywords like REST APIs. After editing, I re-uploaded, hit 85%, and applied for an internship. I was hired within 2 weeks!"
            </p>
            <div className="mt-4 flex items-center gap-3 border-t border-slate-50 pt-3 dark:border-slate-800">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">A</div>
              <div>
                <h4 className="text-xs font-bold">Aman Sharma</h4>
                <p className="text-[10px] text-slate-400">Hired at Innovate Labs</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 flex flex-col justify-between">
            <p className="text-xs text-slate-500 italic leading-relaxed dark:text-slate-400">
              "The Match Score algorithm is scarily accurate. It told me I had a 90% match for a Frontend Developer role and explained my exact skill overlaps. Best career portal I have used."
            </p>
            <div className="mt-4 flex items-center gap-3 border-t border-slate-50 pt-3 dark:border-slate-800">
              <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center text-xs font-bold text-secondary">R</div>
              <div>
                <h4 className="text-xs font-bold">Rhea Gupta</h4>
                <p className="text-[10px] text-slate-400">Intern at TechCorp Solutions</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 flex flex-col justify-between">
            <p className="text-xs text-slate-500 italic leading-relaxed dark:text-slate-400">
              "As a recruiter, ranking applicants by match percentage saves hours of work. Instead of parsing 200 PDFs manually, I shortlist the top 10 ranked by CareerGenie."
            </p>
            <div className="mt-4 flex items-center gap-3 border-t border-slate-50 pt-3 dark:border-slate-800">
              <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center text-xs font-bold text-success">M</div>
              <div>
                <h4 className="text-xs font-bold">Marcus Vance</h4>
                <p className="text-[10px] text-slate-400">Talent Lead at FinData Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing
