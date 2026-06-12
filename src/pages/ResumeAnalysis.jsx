import React, { useState, useEffect } from 'react'
import API from '../services/api'
import { toast } from 'react-hot-toast'
import { UploadCloud, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

function ResumeAnalysis() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [report, setReport] = useState(null)

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await API.get('/api/resume/latest')
        if (response.data && response.data.success) {
          setReport(response.data.data)
        }
      } catch (err) { }
    }
    fetchLatest()
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const allowed = ['.pdf', '.docx']
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    if (!allowed.includes(ext)) return toast.error("Only PDF or DOCX files are allowed!")
    if (file.size > 10 * 1024 * 1024) return toast.error("Maximum file size limit is 10 MB!")
    setSelectedFile(file)
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFile) return toast.error("Please choose a file first")
    setUploading(true)
    const formData = new FormData()
    formData.append('resume', selectedFile)
    try {
      const response = await API.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (response.data && response.data.success) {
        setReport(response.data.data)
        toast.success("Resume analyzed successfully!")
      }
    } catch (err) {
      console.error("Upload error:", err)
      toast.error(err.response?.data?.message || "Analysis failed!")
    } finally {
      setUploading(false)
    }
  }

  const handlePrint = () => window.print()

  const getScoreColor = (score) => {
    if (score >= 80) return { text: 'text-green-500', border: 'border-green-500' }
    if (score >= 50) return { text: 'text-yellow-500', border: 'border-yellow-500' }
    return { text: 'text-red-500', border: 'border-red-500' }
  }

  const scoreColors = report ? getScoreColor(report.score) : {}

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">

      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-extrabold tracking-tight">AI Resume Analyzer</h1>
        <p className="text-xs text-slate-400 mt-1">Get detailed insights on how ATS compatible your resume is, find missing keywords, and get structural reviews.</p>
      </div>

      {/* Upload Zone */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold text-sm mb-4">Upload Resume</h3>
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-50 transition-colors">
            <UploadCloud className="h-10 w-10 text-slate-400 mb-3" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {selectedFile ? selectedFile.name : 'Drag and drop your PDF or DOCX file here'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">Accepts files up to 10 MB</span>
            <input type="file" id="resume-file" onChange={handleFileChange} className="hidden" accept=".pdf,.docx" />
            <label htmlFor="resume-file" className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 cursor-pointer">
              Browse Files
            </label>
          </div>
          <div className="flex justify-end gap-3">
            {selectedFile && (
              <button type="submit" disabled={uploading} className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-primary-dark transition-all disabled:opacity-70 flex items-center gap-2">
                {uploading ? (<><RefreshCw className="h-4 w-4 animate-spin" />Analyzing Resume...</>) : 'Analyze Resume'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* No report yet */}
      {!report && (
        <div className="flex justify-center items-center py-16">
          <p className="text-slate-400 text-sm">Please upload a resume to see the analysis...</p>
        </div>
      )}

      {/* Modal Popup */}
      {report && (
        <>
          {/* Dark overlay */}
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setReport(null)} />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-8">

              {/* Header */}
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-extrabold">Resume Analysis Report</h2>
                <button onClick={() => setReport(null)} className="text-slate-400 hover:text-red-500 text-xl font-bold">✕</button>
              </div>

              {/* Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall Score</span>
                  <div className={`mt-4 flex h-28 w-28 items-center justify-center rounded-full border-[6px] ${scoreColors.border} border-opacity-20`}>
                    <div className={`flex h-24 w-24 items-center justify-center rounded-full border-4 ${scoreColors.border} text-3xl font-extrabold ${scoreColors.text}`}>
                      {report.score || 0}
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-slate-400">A score above 80 is considered excellent.</p>
                </div>

                <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Skills Match</span>
                  <div className="mt-4 flex h-28 w-28 items-center justify-center rounded-full border-[6px] border-blue-200">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-blue-500 text-2xl font-extrabold text-blue-500">
                      {report.skillsMatch || 'N/A'}
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-slate-400">How well your skills match job requirements.</p>
                </div>

                <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Keyword Optimization</span>
                  <div className="mt-4 flex h-28 w-28 items-center justify-center rounded-full border-[6px] border-purple-200">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-purple-500 text-2xl font-extrabold text-purple-500">
                      {report.keywordOptimization || 'N/A'}
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-slate-400">ATS keyword density and coverage.</p>
                </div>
              </div>

              {/* Parsed Info */}
              {report.parsedData && (
                <div className="glass rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-sm border-b border-slate-100 pb-3 dark:border-slate-800">Detected Resume Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Name</span>
                      <p className="text-sm font-semibold">{report.parsedData.name || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Email</span>
                      <p className="text-sm font-semibold">{report.parsedData.email || '—'}</p>
                    </div>
                    {report.parsedData.skills?.length > 0 && (
                      <div className="md:col-span-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Detected Skills</span>
                        <div className="flex flex-wrap gap-1.5">
                          {report.parsedData.skills.map((skill, i) => (
                            <span key={i} className="rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-[10px] font-semibold">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {report.suggestions?.length > 0 && (
                <div className="glass rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-sm border-b border-slate-100 pb-3 dark:border-slate-800">AI Suggestions & Improvements</h3>
                  <div className="space-y-3">
                    {report.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-slate-700 leading-relaxed">{suggestion}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-green-700">
                        {report.score >= 80 ? 'Strong Resume! Ready for Applications 🎉' : report.score >= 60 ? 'Good Resume — Needs Minor Improvements 📝' : 'Needs Significant Work ⚠️'}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">Address the suggestions above to improve your ATS score.</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button onClick={handlePrint} className="text-xs font-semibold text-slate-500 hover:text-primary hover:underline print:hidden">
                      Download Report PDF
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </>
      )}

    </div>
  )
}

export default ResumeAnalysis