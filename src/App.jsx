import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';

import MainLayout from './components/MainLayout';
import AuthLayout from './components/AuthLayout';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Categories from './pages/Categories';
import LevelSelection from './pages/LevelSelection';
import QuizConfig from './pages/QuizConfig';
import ActiveQuiz from './pages/ActiveQuiz';
import QuizCompleted from './pages/QuizCompleted';
import Progress from './pages/Progress';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-color text-primary font-bold">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Unauthenticated Route */}
        {!session ? (
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          /* Authenticated Routes */
          <>
            <Route element={<MainLayout session={session} />}>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/levels/:categoryId" element={<LevelSelection />} />
              <Route path="/quiz-config/:categoryId/:levelId" element={<QuizConfig />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/quiz-complete" element={<QuizCompleted />} />
              {/* Default fallback */}
              <Route path="/analytics" element={<Navigate to="/progress" replace />} />
            </Route>
            
            {/* Quiz Route - No Navbar/Footer layout */}
            <Route path="/quiz/:categoryId/:levelId" element={<ActiveQuiz />} />
            
            {/* Catch-all for authenticated users */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
