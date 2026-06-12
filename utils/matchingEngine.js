/**
 * CareerGenie Job Matching Engine
 * Formula: matchScore = (skillScore * 0.4) + (educationScore * 0.3) + (experienceScore * 0.2) + (keywordScore * 0.1)
 */

function calculateMatch(studentProfile, job) {
  if (!studentProfile) {
    return {
      score: 0,
      skills: 0,
      education: 0,
      experience: 0,
      keywords: 0,
      gap: job.skills || []
    };
  }

  // 1. Skill Score (40%)
  // Ratio of job skills the student has
  const studentSkills = (studentProfile.skills || []).map(s => s.toLowerCase().trim());
  const jobSkills = (job.skills || []).map(s => s.toLowerCase().trim());
  
  let skillScore = 100;
  let missingSkills = [];
  
  if (jobSkills.length > 0) {
    const matchingSkills = jobSkills.filter(skill => studentSkills.includes(skill));
    skillScore = Math.round((matchingSkills.length / jobSkills.length) * 100);
    missingSkills = jobSkills.filter(skill => !studentSkills.includes(skill));
  }

  // 2. Education Score (30%)
  // Simple NLP/Keyword matching between student branch/college and job description/requirements
  let educationScore = 70; // Base score for college students
  const branch = (studentProfile.branch || '').toLowerCase();
  const desc = (job.description || '').toLowerCase();
  const title = (job.title || '').toLowerCase();

  // Tech job checking
  const isTechJob = title.includes('developer') || title.includes('engineer') || title.includes('programmer') || title.includes('tech') || title.includes('software');
  const isTechBranch = branch.includes('computer') || branch.includes('it') || branch.includes('information') || branch.includes('software') || branch.includes('cse');
  
  if (isTechJob && isTechBranch) {
    educationScore = 100;
  } else if (isTechJob && !isTechBranch) {
    educationScore = 40; // Penalty for non-tech branch applying to tech job
  } else if (branch && desc.includes(branch)) {
    educationScore = 90;
  }

  // 3. Experience Score (20%)
  // Basic heuristic: check if job specifies "Senior", "Lead", "Manager" or requires multiple years of experience.
  let experienceScore = 80; // Default for internship/entry levels
  const isSeniorJob = desc.includes('senior') || desc.includes('lead') || desc.includes('manager') || desc.includes('5+ years') || desc.includes('experience of 3');
  
  // Since students are freshers, they get lower experience scores for senior jobs
  if (isSeniorJob) {
    experienceScore = 30;
  } else if (desc.includes('intern') || desc.includes('entry') || desc.includes('fresher') || desc.includes('no experience')) {
    experienceScore = 100;
  }

  // 4. Keyword Score (10%)
  // Calculate text similarity based on matching keywords
  let keywordScore = 50;
  const combinedStudentText = `${branch} ${studentSkills.join(' ')}`.toLowerCase();
  const combinedJobText = `${job.title} ${job.description} ${jobSkills.join(' ')}`.toLowerCase();
  
  const keywords = ['react', 'node', 'javascript', 'python', 'mongodb', 'sql', 'django', 'flask', 'css', 'html', 'cloud', 'aws', 'docker', 'git', 'nlp', 'ai', 'data science', 'analytics'];
  
  let studentKeywords = keywords.filter(kw => combinedStudentText.includes(kw));
  let jobKeywords = keywords.filter(kw => combinedJobText.includes(kw));
  
  if (jobKeywords.length > 0) {
    const commonKeywords = jobKeywords.filter(kw => studentKeywords.includes(kw));
    keywordScore = Math.round((commonKeywords.length / jobKeywords.length) * 100);
  } else {
    keywordScore = 100;
  }

  // Calculate final weighted score
  const finalScore = Math.round(
    (skillScore * 0.4) +
    (educationScore * 0.3) +
    (experienceScore * 0.2) +
    (keywordScore * 0.1)
  );

  return {
    score: Math.min(100, Math.max(0, finalScore)),
    breakdown: {
      skillScore,
      educationScore,
      experienceScore,
      keywordScore
    },
    missingSkills
  };
}

module.exports = { calculateMatch };
