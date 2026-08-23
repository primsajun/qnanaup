# QnanaUp - Quiz & Learning Platform

**QnanaUp** (Quiz. Playful. Level Up.) is an interactive, playful, and responsive web-based learning platform designed to test knowledge and track mastery across various subjects.

## 🌟 Key Features
- **Categorized Quizzes:** Diverse topics including General Knowledge, Science, Math, and History.
- **Adaptive Difficulty:** Questions categorized by difficulty levels (Easy, Medium, Hard, Expert).
- **Progress Tracking:** A dedicated analytics dashboard tracking user accuracy and category mastery.
- **Secure Authentication:** Seamless Google OAuth sign-in.
- **Playful UI/UX:** Engaging visual elements including a matrix digital rain background, nostalgic 8-bit animations, and a sleek, translucent sticky navigation bar.

## 🛠️ Technology Stack & Purpose
- **React.js:** Used as the core frontend library for building reusable, reactive UI components and managing complex application state.
- **Vite:** Used as the build tool and development server for lightning-fast Hot Module Replacement (HMR) and optimized production builds.
- **Tailwind CSS:** Used for utility-first, highly responsive styling, allowing for rapid UI development and custom animations without writing raw CSS.
- **React Router:** Handled client-side routing to create a seamless Single Page Application (SPA) experience without page reloads.
- **Supabase:** Served as the Backend-as-a-Service (BaaS).
  - *PostgreSQL Database:* Stored questions, categories, and user progress.
  - *Supabase Auth:* Managed secure user authentication (Google OAuth).
- **Netlify:** Provided continuous deployment and global edge hosting for the frontend application.

## 🚧 Challenges Faced & Solutions

### 1. Database Hibernation on Free Tier
**Problem:** Supabase automatically pauses free-tier databases after 7 days of inactivity, which would break the live Netlify application for users if no one logged in for a week.
**Solution:** Configured an automated scheduled task using **cron-job.org** to ping the Supabase REST API every few days. This securely fetched a single row of data in the background, proving activity and preventing the database from ever entering hibernation.

### 2. OAuth Redirect Mismatches in Production
**Problem:** After deploying the app to Netlify, users logging in via Google OAuth were incorrectly redirected back to `localhost:5173`, resulting in a "Site Can't Be Reached" error on production.
**Solution:** Reconfigured the Supabase Authentication settings. The primary **Site URL** was updated to the live Netlify domain (`qnanaup.netlify.app`) to fix production, while `localhost:5173` was moved to the **Additional Redirect URLs** allowlist to safely maintain local development capabilities.

### 3. CSS Layout Breaking Sticky Positioning
**Problem:** The top navigation bar was set to `position: sticky` to remain visible while users scrolled through long quiz pages, but it would completely disappear upon scrolling.
**Solution:** Debugged the DOM and identified a CSS quirk where an `overflow-hidden` class on the root `<main>` layout wrapper was silently disabling the sticky behavior of its children. The layout was refactored to isolate the `overflow-hidden` property exclusively to the decorative background containers, restoring the sticky navbar functionality without breaking the page layout.
