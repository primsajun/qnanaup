import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center pt-8 bg-bg-color relative z-0 px-4 pb-12">
      {/* Top Logo */}
      <div className="z-10 mb-8">
        <Link to="/" className="flex items-center gap-2 bg-surface px-6 py-2 rounded-md shadow-sm border border-border-color hover-lift">
          <div className="text-primary font-bold text-lg tracking-tight">
            Qnanaup
          </div>
        </Link>
      </div>

      <main className="w-full flex flex-col items-center justify-start z-10">
        <Outlet />
      </main>
    </div>
  );
}
