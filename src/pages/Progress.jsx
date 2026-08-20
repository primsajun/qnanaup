import { TrendingUp, TrendingDown } from 'lucide-react';

export default function Progress() {
  const categories = [
    { name: 'Algorithms', level: 3, completed: 450, total: 1000, accuracy: 45 },
    { name: 'Data Structures', level: 5, completed: 920, total: 1000, accuracy: 92 },
    { name: 'System Design', level: 1, completed: 120, total: 1000, accuracy: 12 },
  ];

  return (
    <div className="container py-12 animate-fade-in max-w-4xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Learning Progress</h1>
        <p className="text-secondary text-lg">
          Track your mastery across all disciplines.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface border p-6 rounded-xl shadow-sm text-center flex flex-col justify-center">
          <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Total Questions</div>
          <div className="text-3xl font-bold text-primary">2,450</div>
        </div>
        <div className="bg-surface border p-6 rounded-xl shadow-sm text-center flex flex-col justify-center">
          <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Overall Accuracy</div>
          <div className="text-3xl font-bold text-primary">78%</div>
        </div>
        <div className="bg-surface border p-6 rounded-xl shadow-sm text-center flex flex-col justify-center">
          <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Current Streak</div>
          <div className="text-3xl font-bold text-primary">🔥 5 Days</div>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-surface border p-6 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <TrendingUp size={24} className="text-primary" />
          </div>
          <div>
            <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Strongest Category</div>
            <div className="font-bold text-lg">Data Structures</div>
            <div className="text-primary text-sm font-semibold">92% Accuracy</div>
          </div>
        </div>
        
        <div className="bg-surface border p-6 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <TrendingDown size={24} className="text-error" />
          </div>
          <div>
            <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Needs Focus</div>
            <div className="font-bold text-lg">System Design</div>
            <div className="text-error text-sm font-semibold">45% Accuracy</div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h2 className="text-xl font-bold mb-4">Category Breakdown</h2>
        <div className="border-t mb-6"></div>
        
        <div className="flex flex-col gap-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-surface border p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-bold text-lg">{cat.name}</div>
                  <div className="text-secondary text-sm">Level {cat.level} • {cat.completed}/{cat.total} Questions</div>
                </div>
                <div className="text-2xl font-bold text-primary">{cat.accuracy}%</div>
              </div>
              
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full" 
                  style={{ width: `${cat.accuracy}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
