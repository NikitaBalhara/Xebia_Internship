const mockJobs = [
  {
    _id: "job1",
    title: "Software Engineer",
    company: "Genie AI Corp",
    location: "Remote",
    salary: "₹12,000 - ₹15,000",
    description: "Looking for a skilled developer proficient in React and Node.js.",
    skills: ["React", "Node.js", "JavaScript"],
    type: "Full-time",
    status: "approved",
    matchScore: 85,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    _id: "job2",
    title: "Senior Developer",
    company: "Hexa Tech Solutions",
    location: "Remote",
    salary: "₹18,000 - ₹22,000",
    description: "Lead team operations and manage core architecture.",
    skills: ["React", "Express", "MongoDB"],
    type: "Full-time",
    status: "approved",
    matchScore: 72,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
  },
  {
    _id: "job3",
    title: "Frontend Developer",
    company: "TechNova India",
    location: "Bangalore",
    salary: "₹15,000 - ₹20,000",
    description: "Build beautiful UI components using React and Tailwind CSS.",
    skills: ["React", "Tailwind", "HTML", "CSS"],
    type: "Full-time",
    status: "approved",
    matchScore: 90,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
  },
  {
    _id: "job4",
    title: "Data Science Intern",
    company: "Analytics Hub",
    location: "Delhi",
    salary: "₹8,000 - ₹12,000",
    description: "Work on real-world ML models and data pipelines.",
    skills: ["Python", "ML", "Pandas", "NumPy"],
    type: "Internship",
    status: "approved",
    matchScore: 68,
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
  },
  {
    _id: "job5",
    title: "Backend Developer",
    company: "CloudBase Systems",
    location: "Hyderabad",
    salary: "₹14,000 - ₹18,000",
    description: "Develop scalable REST APIs using Node.js and MongoDB.",
    skills: ["Node.js", "Express", "MongoDB"],
    type: "Full-time",
    status: "approved",
    matchScore: 78,
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000)
  },
  {
    _id: "job6",
    title: "AI/ML Engineer",
    company: "DeepMind Solutions",
    location: "Pune",
    salary: "₹20,000 - ₹28,000",
    description: "Design and deploy machine learning models for production.",
    skills: ["Python", "TensorFlow", "Deep Learning"],
    type: "Full-time",
    status: "approved",
    matchScore: 65,
    deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000)
  },
  {
    _id: "job7",
    title: "Full Stack Developer",
    company: "StartupX",
    location: "Mumbai",
    salary: "₹16,000 - ₹22,000",
    description: "End-to-end development of web applications.",
    skills: ["React", "Node.js", "MongoDB", "Express"],
    type: "Full-time",
    status: "approved",
    matchScore: 88,
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
  },
  {
    _id: "job8",
    title: "Python Developer Intern",
    company: "CodeCraft Labs",
    location: "Remote",
    salary: "₹6,000 - ₹10,000",
    description: "Build automation scripts and data processing tools.",
    skills: ["Python", "Django", "REST API"],
    type: "Internship",
    status: "approved",
    matchScore: 70,
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
  },
  {
    _id: "job9",
    title: "DevOps Engineer",
    company: "Infra Pro",
    location: "Chennai",
    salary: "₹22,000 - ₹30,000",
    description: "Manage CI/CD pipelines and cloud infrastructure.",
    skills: ["Docker", "Kubernetes", "AWS", "Linux"],
    type: "Full-time",
    status: "approved",
    matchScore: 60,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
  },
  {
    _id: "job10",
    title: "UI/UX Designer",
    company: "PixelCraft Studio",
    location: "Gurugram",
    salary: "₹10,000 - ₹15,000",
    description: "Design intuitive user interfaces for web and mobile apps.",
    skills: ["Figma", "Adobe XD", "Wireframing"],
    type: "Full-time",
    status: "approved",
    matchScore: 55,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
  },
  {
    _id: "job11",
    title: "React Native Developer",
    company: "MobiTech",
    location: "Noida",
    salary: "₹14,000 - ₹19,000",
    description: "Develop cross-platform mobile apps using React Native.",
    skills: ["React Native", "JavaScript", "Firebase"],
    type: "Full-time",
    status: "approved",
    matchScore: 75,
    deadline: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000)
  },
  {
    _id: "job12",
    title: "Cybersecurity Analyst",
    company: "SecureNet India",
    location: "Bangalore",
    salary: "₹18,000 - ₹25,000",
    description: "Monitor and protect systems from cyber threats.",
    skills: ["Networking", "Ethical Hacking", "Linux"],
    type: "Full-time",
    status: "approved",
    matchScore: 58,
    deadline: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000)
  },
  {
    _id: "job13",
    title: "Data Analyst Intern",
    company: "BizInsights Co.",
    location: "Delhi",
    salary: "₹7,000 - ₹10,000",
    description: "Analyze business data and create dashboards in Power BI.",
    skills: ["Excel", "Power BI", "SQL", "Python"],
    type: "Internship",
    status: "approved",
    matchScore: 63,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  },
  {
    _id: "job14",
    title: "Cloud Engineer",
    company: "SkyOps Technologies",
    location: "Hyderabad",
    salary: "₹20,000 - ₹27,000",
    description: "Deploy and manage applications on AWS and Azure.",
    skills: ["AWS", "Azure", "Terraform", "Python"],
    type: "Full-time",
    status: "approved",
    matchScore: 67,
    deadline: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000)
  },
  {
    _id: "job15",
    title: "Java Backend Intern",
    company: "Enterprise Soft",
    location: "Pune",
    salary: "₹8,000 - ₹12,000",
    description: "Work on Spring Boot microservices and REST APIs.",
    skills: ["Java", "Spring Boot", "MySQL"],
    type: "Internship",
    status: "approved",
    matchScore: 62,
    deadline: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000)
  }
];

exports.getJobs = async (req, res) => {
  try {
    let filtered = [...mockJobs];
    if (req.query.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(req.query.location.toLowerCase())
      );
    }
    if (req.query.search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(req.query.search.toLowerCase()) ||
        job.company.toLowerCase().includes(req.query.search.toLowerCase())
      );
    }
    return res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    return res.status(200).json({ success: true, data: [] });
  }
};

exports.createJob = async (req, res) => {
  return res.status(201).json({ success: true, message: "Job created successfully" });
};

exports.getJob = async (req, res) => {
  const job = mockJobs.find(j => j._id === req.params.id) || mockJobs[0];
  return res.status(200).json({ success: true, data: job });
};

exports.updateJob = async (req, res) => {
  return res.status(200).json({ success: true, message: "Job updated" });
};

exports.deleteJob = async (req, res) => {
  return res.status(200).json({ success: true, message: "Job deleted" });
};

exports.moderateJob = async (req, res) => {
  return res.status(200).json({ success: true, message: "Job moderated" });
};