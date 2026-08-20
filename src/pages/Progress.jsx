import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Trophy, Target, Flame, TrendingUp, TrendingDown } from 'lucide-react';

export default function Progress() {
  const [stats, setStats] = useState({ total: 0, correct: 0, streak: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const [
          { data: totalsData }, 
          { data: datesData },
          { data: masteryData }
        ] = await Promise.all([
          supabase.rpc('get_user_totals', { p_user_id: session.user.id }),
          supabase.rpc('get_user_activity_dates', { p_user_id: session.user.id }),
          supabase.rpc('get_category_mastery', { p_user_id: session.user.id })
        ]);
        
        let streak = 0;
        if (datesData && datesData.length > 0) {
          const dates = datesData.map(d => {
            const [y, m, day] = d.activity_date.split('-');
            return new Date(y, m - 1, day).getTime();
          }).sort((a, b) => b - a);

          const today = new Date();
          today.setHours(0,0,0,0);
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          if (dates[0] === today.getTime() || dates[0] === yesterday.getTime()) {
            streak = 1;
            let expectedNext = new Date(dates[0]);
            for (let i = 1; i < dates.length; i++) {
              expectedNext.setDate(expectedNext.getDate() - 1);
              if (dates[i] === expectedNext.getTime()) {
                streak++;
              } else {
                break;
              }
            }
          }
        }
        
        setStats({
          total: totalsData?.[0]?.total_answered || 0,
          correct: totalsData?.[0]?.total_correct || 0,
          streak: streak
        });

        if (masteryData) {
          const processedCategories = masteryData.map(cat => {
            const accuracy = cat.total_questions > 0 
              ? Math.round((cat.correct_answers / cat.total_questions) * 100) 
              : 0;
            return {
              name: cat.category,
              total: cat.total_questions,
              correct: cat.correct_answers,
              accuracy
            };
          });
          // Sort by accuracy descending
          processedCategories.sort((a, b) => b.accuracy - a.accuracy);
          setCategories(processedCategories);
        }

      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  
  // Calculate strongest and weakest
  // Only consider categories where the user has answered at least 1 question
  const activeCategories = categories.filter(c => c.total > 0);
  const strongest = activeCategories.length > 0 ? activeCategories[0] : null;
  const weakest = activeCategories.length > 0 ? activeCategories[activeCategories.length - 1] : null;

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
          <div className="text-3xl font-bold text-primary">{loading ? '...' : stats.total}</div>
        </div>
        <div className="bg-surface border p-6 rounded-xl shadow-sm text-center flex flex-col justify-center">
          <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Overall Accuracy</div>
          <div className="text-3xl font-bold text-primary">{loading ? '...' : `${accuracy}%`}</div>
        </div>
        <div className="bg-surface border p-6 rounded-xl shadow-sm text-center flex flex-col justify-center">
          <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Current Streak</div>
          <div className="text-3xl font-bold text-primary">🔥 {loading ? '...' : `${stats.streak} Days`}</div>
        </div>
      </div>

      {/* Highlights */}
      {!loading && activeCategories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-surface border p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <TrendingUp size={24} className="text-primary" />
            </div>
            <div>
              <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Strongest Category</div>
              <div className="font-bold text-lg">{strongest.name}</div>
              <div className="text-primary text-sm font-semibold">{strongest.accuracy}% Accuracy</div>
            </div>
          </div>
          
          <div className="bg-surface border p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <TrendingDown size={24} className="text-error" />
            </div>
            <div>
              <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Needs Focus</div>
              <div className="font-bold text-lg">{weakest.name}</div>
              <div className="text-error text-sm font-semibold">{weakest.accuracy}% Accuracy</div>
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div>
        <h2 className="text-xl font-bold mb-4">Category Breakdown</h2>
        <div className="border-t mb-6"></div>
        
        {loading ? (
          <div className="text-center text-secondary py-8">Loading your progress...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-secondary py-8">No categories available yet.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-surface border p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-bold text-lg">{cat.name}</div>
                    <div className="text-secondary text-sm">
                      {cat.correct} / {cat.total} Questions Correct
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary">{cat.accuracy}%</div>
                </div>
                
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${cat.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
