# CareerGenie

CareerGenie is a job portal with a resume analyzer. Upload a PDF resume and get a score, detected skills and suggestions to improve it. This project was built during my internship at Xebia.

## Live Demo

- Frontend: https://xebia-internship-fh43.vercel.app
- Backend API: https://careergenie-backend-v8qq.onrender.com

> The backend runs on Render's free plan, so the first request after a break can take up to a minute to wake up.

## Repository Structure

| Branch | Contents |
|--------|----------|
| `main` | Frontend (React + Vite) |
| `backend` | Backend (Node.js + Express) |

## Features

- Job portal pages: Dashboard, Jobs, Analysis, Applications, Messages
- Resume analyzer: upload a PDF, the backend reads the text and returns the candidate name, email, detected skills, a score out of 100 and suggestions
- Light and dark mode
- Download the analysis report as PDF

## How the Resume Analysis Works

The analysis is rule-based (it is not a machine learning model):

1. The backend extracts text from the uploaded PDF.
2. The name is taken from the top of the resume and the email is found with a pattern match.
3. Skills are matched against a built-in list of common technologies.
4. The score is calculated from the number of skills found, contact details, and sections like education, projects, experience and certifications.

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Axios

**Backend:** Node.js, Express, JWT, Multer, pdf-parse, Helmet, CORS, express-rate-limit

**Database:** in-memory mock database (no external database needed)

**Hosting:** Vercel (frontend), Render (backend)

## Run Locally

### Frontend (`main` branch)

```bash
git clone https://github.com/NikitaBalhara/Xebia_Internship.git
cd Xebia_Internship
npm install
npm run dev
```

Before running locally, set `baseURL` in `src/services/api.js` to your local backend (for example `http://localhost:5000`).

### Backend (`backend` branch)

```bash
git clone -b backend https://github.com/NikitaBalhara/Xebia_Internship.git career-genie-backend
cd career-genie-backend
npm install
npm run dev
```

Create a `.env` file with your own values for `PORT`, `JWT_SECRET` and `JWT_EXPIRE`. Never upload real secrets to GitHub.

## Author

Nikita, B.Tech CSE (Data Science), SGT University, Gurugram
