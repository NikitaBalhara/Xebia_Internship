const pdfParse = require('pdf-parse/lib/pdf-parse.js');

// Skill name + alag-alag likhne ke tareeke
const SKILLS = [
  ['JavaScript', 'JS'], ['TypeScript'], ['Python'], ['Java'], ['C++'], ['C#'],
  ['HTML'], ['CSS'], ['Tailwind CSS', 'Tailwind'], ['React', 'ReactJS', 'React.js'],
  ['Redux'], ['Next.js', 'NextJS'], ['Node.js', 'NodeJS', 'Node'],
  ['Express.js', 'ExpressJS'], ['MongoDB'], ['MySQL'], ['PostgreSQL'], ['SQL'],
  ['Firebase'], ['REST API', 'RESTful API', 'RESTful APIs', 'REST APIs'],
  ['GraphQL'], ['Git'], ['GitHub'], ['Docker'], ['AWS'], ['Azure'], ['Linux'],
  ['Flask'], ['Django'], ['Machine Learning'], ['Deep Learning'], ['NLP'],
  ['Data Analysis'], ['Pandas'], ['NumPy'], ['Scikit-learn'], ['TensorFlow'],
  ['OpenCV'], ['Power BI'], ['Tableau'], ['Excel'], ['Figma'], ['Vite']
];

const ACTION_VERBS = ['developed', 'built', 'designed', 'implemented', 'created',
  'led', 'managed', 'optimized', 'deployed', 'analyzed', 'integrated', 'improved'];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const hasWord = (text, word) =>
  new RegExp('(?<![A-Za-z0-9+#])' + escapeRegex(word) + '(?![A-Za-z0-9+#])', 'i').test(text);

const findName = (lines) => {
  const bad = /resume|curriculum|vitae|profile|summary|objective|education|contact|skills|projects/i;
  for (const line of lines.slice(0, 6)) {
    const words = line.split(/\s+/);
    if (
      /^[A-Za-z][A-Za-z .'-]{2,40}$/.test(line) &&
      words.length >= 2 && words.length <= 4 &&
      !bad.test(line)
    ) {
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
  }
  return null;
};

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a PDF resume" });
    }

    const parsed = await pdfParse(req.file.buffer);
    const text = (parsed.text || '').trim();

    if (text.length < 50) {
      return res.status(422).json({
        success: false,
        message: "Could not read text from this PDF (it may be a scanned image)"
      });
    }

    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

    const name = findName(lines) || "Name not found";
    const emailMatch = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
    const email = emailMatch ? emailMatch[0] : "—";
    const hasPhone = /(\+?\d[\d\s-]{8,}\d)/.test(text);

    const skills = SKILLS
      .filter((names) => names.some((n) => hasWord(text, n)))
      .map((names) => names[0]);

    const sections = {
      education: /education|b\.?tech|bachelor|university|college/i.test(text),
      projects: /projects?/i.test(text),
      experience: /experience|internship|work history/i.test(text),
      skillsSection: /skills|technologies|tech stack/i.test(text),
      certifications: /certification|certificate|courses?/i.test(text)
    };

    const verbCount = ACTION_VERBS.filter((v) => hasWord(text, v)).length;

    // Score (out of 100)
    let score = 0;
    score += Math.min(skills.length, 10) * 4;            // skills: 40
    score += emailMatch ? 10 : 0;                         // email: 10
    score += hasPhone ? 10 : 0;                           // phone: 10
    score += sections.education ? 10 : 0;                 // sections: 40
    score += sections.projects ? 10 : 0;
    score += sections.experience ? 10 : 0;
    score += sections.skillsSection ? 5 : 0;
    score += sections.certifications ? 5 : 0;

    const skillsMatch = Math.round(Math.min(skills.length / 12, 1) * 100);
    const keywordOptimization = Math.round(Math.min(verbCount / 6, 1) * 100);

    const suggestions = [];
    if (!emailMatch) suggestions.push("Add a professional email address at the top of your resume.");
    if (!hasPhone) suggestions.push("Add a phone number so recruiters can contact you.");
    if (skills.length < 6) suggestions.push("Add more relevant technical skills (only ones you actually know).");
    if (!sections.projects) suggestions.push("Add a Projects section with 2-3 of your best projects.");
    if (!sections.experience) suggestions.push("Add an Experience or Internship section.");
    if (!sections.certifications) suggestions.push("Add certifications or courses to strengthen your profile.");
    if (verbCount < 4) suggestions.push("Start bullet points with action verbs like Built, Developed, Designed or Implemented.");
    if (suggestions.length === 0) suggestions.push("Great structure! Quantify your achievements with numbers where possible.");

    return res.status(200).json({
      success: true,
      message: "Resume uploaded and analyzed successfully!",
      data: {
        score,
        skillsMatch: skillsMatch + "%",
        keywordOptimization: keywordOptimization + "%",
        suggestions,
        parsedData: { name, email, skills }
      }
    });
  } catch (error) {
    console.log("Upload error:", error.message);
    return res.status(500).json({ success: false, message: "Error parsing resume" });
  }
};

exports.getResumes = async (req, res) => {
  return res.status(200).json({ success: true, data: [] });
};

exports.getLatestResume = async (req, res) => {
  return res.status(200).json({ success: false, data: null });
};
