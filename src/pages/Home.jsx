import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, Trophy } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container py-16 animate-fade-in flex flex-col items-center">
      
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 relative">
        <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight text-primary">
          Test your knowledge.<br/>Master your subjects.
        </h1>
        <p className="text-secondary text-lg mb-8 max-w-lg">
          Challenge yourself across diverse categories from Easy to Expert. Start your journey today.
        </p>
        <button 
          onClick={() => navigate('/categories')}
          className="btn-primary text-lg px-8 py-4 shadow-md hover-lift flex items-center gap-3"
        >
          <Play size={20} className="fill-white" />
          Start Journey
        </button>
      </div>

      {/* Quick Stats or Features */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="card-magical p-8 flex flex-col items-center text-center group cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => navigate('/categories')}>
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
            <BookOpen size={28} />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-text-primary">Explore Subjects</h3>
          <p className="text-secondary text-sm">Choose from Science, Math, History, and more.</p>
        </div>

        <div className="card-magical p-8 flex flex-col items-center text-center group cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => navigate('/progress')}>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-success group-hover:scale-110 transition-transform">
            <Trophy size={28} />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-text-primary">View Progress</h3>
          <p className="text-secondary text-sm">Track your accuracy and mastery across all categories.</p>
        </div>
      </div>
    </div>
  );
}
