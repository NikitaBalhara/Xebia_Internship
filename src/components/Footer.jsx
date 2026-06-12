import React from 'react'
import { Link } from 'react-router-dom'
import { Briefcase } from 'lucide-react'

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary dark:text-blue-400">
              <Briefcase className="h-5 w-5" />
              <span>Career<span className="text-secondary dark:text-cyan-400">Genie</span></span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Smart AI career helper optimizing resumes, matching job profiles, and tracking applications.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform</h4>
            <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/jobs" className="hover:text-primary dark:hover:text-blue-400">Search Jobs</Link></li>
              <li><Link to="/resume" className="hover:text-primary dark:hover:text-blue-400">Resume Checker</Link></li>
              <li><Link to="/register" className="hover:text-primary dark:hover:text-blue-400">Register</Link></li>
            </ul>
          </div>

          {/* Guidelines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Resources</h4>
            <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary dark:hover:text-blue-400">ATS Formatting Tips</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-blue-400">Resume Templates</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-blue-400">Career Roadmaps</a></li>
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Company</h4>
            <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary dark:hover:text-blue-400">Terms of Use</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-blue-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-blue-400">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-[10px] text-slate-400 dark:border-slate-800 dark:text-slate-500">
          <p>© {new Date().getFullYear()} CareerGenie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
