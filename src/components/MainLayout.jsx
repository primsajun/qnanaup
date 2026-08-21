import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function MainLayout({ session }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative Background Orbs (Clouds & Coins) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/60 blur-[80px] pointer-events-none animate-float-slow z-[-1]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-400/40 blur-[80px] pointer-events-none animate-float-slower z-[-1]"></div>

      {/* Mario Running Animation */}
      <div className="fixed bottom-0 left-0 w-full overflow-hidden pointer-events-none z-0">
        <img 
          src="https://media.tenor.com/2RoqYg003oEAAAAi/mario-run.gif" 
          alt="Running Mario"
          className="w-16 h-16 animate-mario-run mb-2"
        />
      </div>

      <Navbar session={session} />
      <main className="flex-1 flex flex-col z-10">
        <Outlet />
      </main>
    </div>
  );
}
