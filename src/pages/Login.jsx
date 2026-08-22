import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import MatrixBackground from '../components/MatrixBackground';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkSession();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MatrixBackground />

      {/* Main Login Card */}
      <div className="bg-surface rounded-2xl shadow-xl border border-border-color w-full max-w-md p-8 sm:p-10 flex flex-col items-center justify-center text-center animate-fade-in">
        
        {/* Logo Container */}
        <div className="bg-gray-100 rounded-xl p-4 mb-4 flex flex-col items-center justify-center w-20 h-20 shadow-sm">
          <img src="/logo.png" alt="Qnanaup Logo" className="w-10 h-10 object-contain" />
          <span className="text-[10px] font-bold text-primary mt-1 tracking-wide">Qnanaup</span>
        </div>
        
        <h1 className="text-2xl font-bold text-primary mb-4 tracking-tight">Qnanaup</h1>

        <h2 className="text-2xl font-semibold text-text-primary mb-3">
          Master Your Knowledge
        </h2>
        
        <p className="text-secondary text-sm mb-8 leading-relaxed px-2">
          Challenge yourself across categories from Easy to Expert. Sign in to start your journey.
        </p>

        {error && (
          <div className="bg-error-bg border border-error text-error text-sm p-3 rounded mb-6 w-full">
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="w-full btn-outline flex items-center justify-center gap-3 py-3 rounded-lg border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
        >
          {/* Google SVG Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {loading ? 'Connecting...' : 'Sign in with Google'}
        </button>
      </div>
    </>
  );
}
