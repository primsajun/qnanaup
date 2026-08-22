import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  FlaskConical, 
  Calculator, 
  Globe, 
  BookOpen, 
  Dumbbell, 
  Rocket, 
  Microscope,
  Cpu
} from 'lucide-react';

export default function Categories() {
  const navigate = useNavigate();
  const [masteryData, setMasteryData] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMastery = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase.rpc('get_category_mastery', {
          p_user_id: session.user.id
        });

        if (error) throw error;

        if (data) {
          const map = {};
          data.forEach(item => {
            const rawPercentage = item.total_questions > 0 
              ? (item.correct_answers / item.total_questions) * 100 
              : 0;
            
            // If they have > 0 correct but it rounds down to 0, force it to 1% so they see progress
            const percentage = (rawPercentage > 0 && rawPercentage < 1) 
              ? 1 
              : Math.round(rawPercentage);
              
            map[item.category] = {
              total: item.total_questions,
              mastery: percentage
            };
          });
          setMasteryData(map);
        }
      } catch (err) {
        console.error("Error fetching mastery data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMastery();
  }, []);

  const categories = [
    { name: 'Science', icon: <FlaskConical size={24} />, id: 'science' },
    { name: 'Mathematics', icon: <Calculator size={24} />, id: 'math' },
    { name: 'Geography', icon: <Globe size={24} />, id: 'geo' },
    { name: 'History', icon: <BookOpen size={24} />, id: 'history' },
    { name: 'Sports', icon: <Dumbbell size={24} />, id: 'sports' },
    { name: 'Space', icon: <Rocket size={24} />, id: 'space' },
    { name: 'General Knowledge', icon: <Microscope size={24} />, id: 'gk' },
    { name: 'Technology', icon: <Cpu size={24} />, id: 'tech' }
  ];

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-8 animate-fade-in">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wider text-secondary mb-1 uppercase flex items-center gap-2">
            <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/')}>Synapse</span>
            <span className="text-gray-400">&gt;</span>
            <span className="text-primary">Categories</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Choose a Category</h1>
          <p className="text-secondary">
            Select a subject to begin testing your knowledge. Track your<br/>mastery across diverse disciplines.
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..." 
            className="w-full bg-white border border-border-color rounded-lg py-2 px-4 pl-10 focus:outline-none focus:border-primary text-sm shadow-sm"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-12 text-secondary">
          No categories found matching "{searchQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => {
          const catData = masteryData[cat.name] || { total: 0, mastery: 0 };
          
          return (
            <div 
              key={cat.id}
              onClick={() => navigate(`/levels/${cat.name}`)}
              className="card-magical p-6 cursor-pointer flex flex-col group relative overflow-hidden bg-white"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div className="bg-indigo-50 text-primary text-xs font-bold px-2 py-1 rounded">
                  {loading ? '...' : `${catData.mastery}% Mastery`}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-text-primary mb-1">{cat.name}</h3>
              <p className="text-secondary text-xs mb-6">
                {loading ? 'Loading...' : `${catData.total} Questions`} <br/>Available
              </p>
              
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-auto overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-1000"
                  style={{ width: `${catData.mastery}%` }}
                ></div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
