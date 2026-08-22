import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-color items-center">
      {/* Top Logo */}
      <div className="py-8">
        <Link to="/" className="flex items-center gap-2 bg-surface px-4 py-2 rounded-md shadow-sm">
          <div className="flex items-center text-primary font-bold text-lg tracking-tight">
            Synapse
          </div>
        </Link>
      </div>

      <main className="flex-1 w-full max-w-md flex flex-col items-center justify-center -mt-16">
        <Outlet />
      </main>

      <div className="py-8 text-center text-xs text-secondary font-medium mt-auto">
        By continuing, you agree to Synapse's <br />
        <Link to="#" className="underline">Terms of Service</Link> and <Link to="#" className="underline">Privacy Policy</Link>.
      </div>
    </div>
  );
}
