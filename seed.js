const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const Job = require('./models/Job');
const Application = require('./models/Application');

dotenv.config();

const users = [
  {
    name: 'Sarah Jenkins (Student)',
    email: 'student@careergenie.com',
    password: 'password123',
    role: 'student'
  },
  {
    name: 'Google Recruiter',
    email: 'recruiter@careergenie.com',
    password: 'password123',
    role: 'recruiter'
  },
  {
    name: 'System Admin',
    email: 'admin@careergenie.com',
    password: 'password123',
    role: 'admin'
  }
];

const jobs = [
  {
    title: 'Frontend Developer Intern',
    company: 'TechCorp Solutions',
    location: 'Remote',
    salary: '$20 - $25 / hour',
    description: 'We are looking for a motivated Frontend Developer Intern with knowledge of HTML, CSS, JavaScript, and React.js. You will work closely with our core team to design and build state-of-the-art interactive dashboards.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Git'],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'approved'
  },
  {
    title: 'Junior Fullstack Engineer',
    company: 'Innovate Labs',
    location: 'New York, NY',
    salary: '$70,000 - $85,000 / year',
    description: 'Innovate Labs is seeking a Junior Fullstack Engineer proficient in React, Node.js, and MongoDB. Experience with TypeScript and AWS is a huge plus. This is a hybrid role with 3 days in office.',
    skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript'],
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    status: 'approved'
  },
  {
    title: 'Data Analyst Intern',
    company: 'FinData Inc.',
    location: 'Chicago, IL',
    salary: '$30 / hour',
    description: 'FinData is hiring a Data Analyst Intern. You will parse client financial portfolios, build analytical dashboards, and present insights. Must have Python, SQL, and data visualization experience.',
    skills: ['Python', 'SQL', 'Data Science', 'Pandas'],
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    status: 'approved'
  },
  {
    title: 'Python Backend Developer',
    company: 'PyFlow Inc.',
    location: 'Remote',
    salary: '$95,000 - $110,000 / year',
    description: 'Looking for a senior or mid-level developer to structure FastAPI/Django pipelines, build RESTful APIs, and handle SQL database integration. Remote-first workspace.',
    skills: ['Python', 'Django', 'FastAPI', 'SQL', 'PostgreSQL'],
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    status: 'pending' // Pending approval for moderation check
  }
];

const seedDB = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/careergenie');
    console.log('Connected to database for seeding...');

    // Clear existing data
    await User.deleteMany();
    await StudentProfile.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    console.log('Cleared existing data.');

    // Hash passwords and insert users
    const createdUsers = [];
    for (const u of users) {
      // User model has pre-save middleware hashing passwords
      const user = await User.create(u);
      createdUsers.push(user);
      console.log(`Created user: ${u.email}`);
    }

    const studentUser = createdUsers.find(u => u.role === 'student');
    const recruiterUser = createdUsers.find(u => u.role === 'recruiter');

    // Create a mock Student Profile
    const profile = await StudentProfile.create({
      userId: studentUser._id,
      college: 'Global Institute of Technology',
      branch: 'Computer Science and Engineering',
      graduationYear: 2026,
      skills: ['JavaScript', 'HTML', 'CSS', 'React.js', 'Git', 'Python'],
      resumeUrl: '',
      resumeScore: 0
    });
    console.log('Created student profile for Sarah.');

    // Insert jobs
    for (const j of jobs) {
      j.recruiterId = recruiterUser._id;
      await Job.create(j);
      console.log(`Created job: ${j.title}`);
    }

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
