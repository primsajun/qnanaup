import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="text-primary font-bold text-xl tracking-tight">
          Zenviq
        </div>

        {/* Copyright */}
        <div className="text-xs font-medium text-secondary">
          &copy; 2024 Zenviq Knowledge Systems
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs font-semibold text-secondary">
          <Link to="#" className="hover:text-primary transition-colors underline underline-offset-2">Privacy</Link>
          <Link to="#" className="hover:text-primary transition-colors underline underline-offset-2">Terms</Link>
          <Link to="#" className="hover:text-primary transition-colors underline underline-offset-2">Support</Link>
        </div>
      </div>
    </footer>
  );
}
