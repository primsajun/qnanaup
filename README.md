# QnanaUp

## 📌 Overview
**QnanaUp** (Quiz. Playful. Level Up.) is an interactive, playful, and responsive web-based learning platform designed to test knowledge and track mastery across various subjects. It transforms learning into a fun, game-like experience with adaptive difficulty and vibrant UI elements.

## 🛠 Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS, React Router
- **Backend & Database:** Supabase (PostgreSQL, Supabase Auth)
- **Hosting & CI/CD:** Netlify
- **Icons:** Lucide React
- **Infrastructure Utilities:** cron-job.org (Database keep-alive)

## ✨ Features
- **Categorized Quizzes:** Diverse topics including General Knowledge, Science, Math, and History.
- **Adaptive Difficulty:** Questions categorized by difficulty levels (Easy, Medium, Hard, Expert).
- **Secure Authentication:** Seamless Google OAuth sign-in.
- **Progress Tracking:** A dedicated analytics dashboard tracking user accuracy and category mastery over time.
- **Playful UI/UX:** Engaging visual elements including a matrix digital rain background, nostalgic 8-bit animations, and a sleek, translucent sticky navigation bar.
- **Fully Responsive:** Optimized for both mobile and desktop experiences.

## 🏗 Architecture
- **Client:** A Single Page Application (SPA) built with React and Vite, globally distributed and hosted on Netlify.
- **Backend-as-a-Service (BaaS):** Supabase handles all data storage (PostgreSQL) and user session management (Google OAuth). The frontend communicates securely directly with the Supabase REST API.
- **Keep-Alive Worker:** An external cron job pings the Supabase database automatically every few days to prevent the free-tier database from entering hibernation.


## 🚀 Live Demo
Experience the live application here: **[QnanaUp on Netlify](https://qnanaup.netlify.app)**

## ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/primsajun/zenviq.git
   cd zenviq
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file (see the next section) and add your Supabase credentials.

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will start locally at `http://localhost:5173`.

## 🔐 Environment Variables
To run this project locally, you will need to add the following environment variables to a `.env` file in the root of your project:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
