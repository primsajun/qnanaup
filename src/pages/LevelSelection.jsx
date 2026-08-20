import { useParams, useNavigate, Link } from 'react-router-dom';
import { Microscope, ChevronRight } from 'lucide-react';

export default function LevelSelection() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  const categoryName = categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : 'Science';

  const levels = [
    { 
      name: 'Easy', 
      bars: 1, 
      desc: 'Fundamental concepts and foundational principles suitable for beginners.' 
    },
    { 
      name: 'Medium', 
      bars: 2, 
      desc: 'Intermediate theories combining multiple fundamental concepts and applied scenarios.' 
    },
    { 
      name: 'Hard', 
      bars: 3, 
      desc: 'Complex scenarios requiring deep analytical thinking and multi-step deduction.' 
    },
    { 
      name: 'Expert', 
      bars: 4, 
      desc: 'Advanced theory and highly specialized topics meant for domain masters.' 
    },
  ];

  return (
    <div className="container py-12 animate-fade-in max-w-5xl">
      {/* Breadcrumbs */}
      <div className="flex items-center text-xs font-semibold text-secondary mb-6 tracking-wide">
        <Link to="/categories" className="hover:text-primary transition-colors">Categories</Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="capitalize">{categoryName}</span>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-primary">Level Selection</span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm">
          <Microscope size={24} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Choose your level</h1>
      </div>
      
      <p className="text-secondary text-lg mb-12 max-w-2xl">
        Select an academic tier that aligns with your current proficiency in {categoryName}. You can always adjust this later as your knowledge expands.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {levels.map((level, idx) => (
          <div 
            key={idx} 
            className="bg-surface border p-8 rounded-xl shadow-sm hover-lift cursor-pointer flex flex-col h-full"
            onClick={() => navigate(`/quiz/${categoryId}/${level.name.toLowerCase()}`)}
          >
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold">{level.name}</h2>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((bar) => (
                  <div 
                    key={bar} 
                    className={`w-2 h-6 rounded-full ${bar <= level.bars ? 'bg-primary' : 'bg-gray-200'}`}
                  ></div>
                ))}
              </div>
            </div>
            
            <p className="text-secondary text-sm leading-relaxed">
              {level.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
