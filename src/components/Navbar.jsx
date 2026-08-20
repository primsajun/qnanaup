import { Link, useLocation } from 'react-router-dom';
import { Bell, User, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Navbar({ session }) {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'Progress', path: '/progress' },
  ];

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
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center text-primary font-bold text-2xl tracking-tight">
            Zenviq
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || 
                             (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive ? 'text-primary border-b-2 border-primary pb-1' : 'text-secondary hover:text-primary'
                }`}
                style={{ marginBottom: isActive ? '-3px' : '0' }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <button className="text-secondary hover:text-primary transition-colors">
            <Bell size={20} />
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l">
            <div className="text-right hidden md:block">
              <div className="text-xs font-semibold text-primary">Welcome, {fullName.split(' ')[0]}</div>
              <button 
                onClick={handleLogout}
                className="text-xs text-secondary hover:text-error transition-colors flex items-center justify-end gap-1 mt-0.5"
              >
                Sign out <LogOut size={10} />
              </button>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border">
              {avatarUrl ? (
                <img src={avatarUrl} alt="User avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={20} className="text-secondary" />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
