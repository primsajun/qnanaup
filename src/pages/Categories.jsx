import { useNavigate } from 'react-router-dom';
import { Rocket, Cpu, Microscope, Globe, Calculator, Trophy, BookOpen, Search } from 'lucide-react';

export default function Categories() {
  const navigate = useNavigate();

  const categories = [
    { name: 'Science', icon: <Microscope size={24} className="text-primary" />, mastery: 75, questions: '1,000+' },
    { name: 'Technology', icon: <Cpu size={24} className="text-primary" />, mastery: 42, questions: '1,000+' },
    { name: 'History', icon: <BookOpen size={24} className="text-primary" />, mastery: 0, questions: '1,000+' },
    { name: 'Geography', icon: <Globe size={24} className="text-primary" />, mastery: 90, questions: '1,000+' },
    { name: 'Mathematics', icon: <Calculator size={24} className="text-primary" />, mastery: 15, questions: '1,000+' },
    { name: 'Sports', icon: <Trophy size={24} className="text-primary" />, mastery: 0, questions: '1,000+' },
    { name: 'Space', icon: <Rocket size={24} className="text-primary" />, mastery: 60, questions: '1,000+' },
    { name: 'General Knowledge', icon: <BookOpen size={24} className="text-primary" />, mastery: 88, questions: '1,000+' },
  ];

  return (
    <div className="container py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6">
        <div>
          <div className="text-xs font-semibold text-secondary mb-2 flex items-center gap-1 uppercase tracking-wider">
            <span>Zenviq</span>
            <span>&gt;</span>
            <span className="text-primary">Categories</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Choose a Category</h1>
          <p className="text-secondary max-w-xl text-lg">
            Select a subject to begin testing your knowledge. Track your mastery across diverse disciplines.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
          <input 
            type="text" 
            placeholder="Search categories..." 
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface transition-shadow shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <div 
            key={idx} 
            className="bg-surface border p-6 rounded-xl shadow-sm hover-lift cursor-pointer flex flex-col"
            onClick={() => navigate(`/levels/${cat.name.toLowerCase()}`)}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                {cat.icon}
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded-md ${cat.mastery > 0 ? 'bg-blue-100 text-primary' : 'bg-gray-100 text-secondary'}`}>
                {cat.mastery}% Mastery
              </div>
            </div>
            
            <div className="font-bold text-xl mb-1">{cat.name}</div>
            <div className="text-secondary text-sm mb-4">{cat.questions} Questions<br/>Available</div>
            
            <div className="mt-auto">
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${cat.mastery > 0 ? 'bg-primary' : 'bg-gray-300'}`} 
                  style={{ width: `${Math.max(cat.mastery, 0)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
