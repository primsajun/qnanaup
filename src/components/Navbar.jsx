import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Navbar({ session }) {
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const userMeta = session?.user?.user_metadata;
  const fullName = userMeta?.full_name || 'Student';
  const avatarUrl = userMeta?.avatar_url;

  return (
    <nav className="border-b border-border-color bg-surface">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group relative">
          {/* Floating Mario Star */}
          <img 
            src="https://media.tenor.com/a4fJqgV-kCQAAAAi/mario-star.gif" 
            alt="Star" 
            className="w-8 h-8 absolute -left-10 -top-2 animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          />
          <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
          <div className="flex items-center text-primary font-bold text-2xl tracking-tight">
            Qnanaup
          </div>
        </Link>

        {/* Empty middle spacer to keep logo left and actions right */}
        <div className="flex-1"></div>

        {/* User Actions */}
        <div className="flex items-center gap-6">
          <div className="text-sm font-bold text-text-primary">
            Welcome, {fullName.split(' ')[0]}
          </div>
          
          <div className="relative pl-6 border-l border-border-color" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border hover:ring-2 hover:ring-primary transition-all focus:outline-none"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="User avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={20} className="text-secondary" />
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-border-color rounded-xl shadow-lg py-2 z-50 animate-fade-in text-sm">
                <div className="px-4 py-2 border-b border-border-color mb-1">
                  <p className="text-xs text-secondary">Signed in as</p>
                  <p className="font-bold text-text-primary truncate">{fullName}</p>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-error hover:bg-error-bg flex items-center gap-2 transition-colors"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
