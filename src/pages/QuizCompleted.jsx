import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Target, Clock, RotateCcw } from 'lucide-react';

export default function QuizCompleted() {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId, levelId } = useParams();
  
  // Default to mock data if accessed directly without state
  const stats = location.state?.stats || {
    correct: 16,
    incorrect: 4,
    breakdown: [true, true, true, false, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, false]
  };

  const totalQuestions = stats.correct + stats.incorrect;
  const accuracy = totalQuestions > 0 ? Math.round((stats.correct / totalQuestions) * 100) : 0;
  
  const categoryName = categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : 'Science';

  return (
    <div className="container py-16 animate-fade-in flex flex-col items-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-2">Quiz Completed</h1>
        <p className="text-secondary text-lg font-medium">{categoryName}</p>
      </div>

      <div className="w-full max-w-3xl flex flex-col md:flex-row gap-6 mb-6">
        {/* Final Score Card */}
        <div className="bg-surface border p-8 rounded-xl shadow-sm flex-1 flex flex-col items-center justify-center min-h-[200px]">
          <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">Final Score</div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-bold">{stats.correct}</span>
            <span className="text-3xl text-secondary font-medium">/ {totalQuestions}</span>
          </div>
        </div>

        <div className="flex flex-col gap-6 md:w-64 flex-shrink-0">
          {/* Accuracy Card */}
          <div className="bg-surface border p-6 rounded-xl shadow-sm flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest">Accuracy</span>
              <Target size={16} className="text-secondary" />
            </div>
            <div className="text-3xl font-bold">{accuracy}%</div>
          </div>

          {/* Time Taken Card (Mocked for now as we didn't track actual time in this demo) */}
          <div className="bg-surface border p-6 rounded-xl shadow-sm flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest">Time Taken</span>
              <Clock size={16} className="text-secondary" />
            </div>
            <div className="text-3xl font-bold">--:--</div>
          </div>
        </div>
      </div>

      {/* Question Breakdown */}
      {totalQuestions > 0 && (
        <div className="w-full max-w-3xl bg-surface border p-8 rounded-xl shadow-sm mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Question Breakdown</h2>
            <div className="flex gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-success"></div> {stats.correct} Correct</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-error"></div> {stats.incorrect} Incorrect</div>
            </div>
          </div>

          {/* Progress bar visual */}
          <div className="w-full h-3 rounded-full flex overflow-hidden mb-6">
            <div className="bg-success h-full" style={{ width: `${accuracy}%` }}></div>
            <div className="bg-error h-full" style={{ width: `${100 - accuracy}%` }}></div>
          </div>

          {/* Question circles */}
          <div className="flex flex-wrap gap-2">
            {stats.breakdown.map((isCorrect, idx) => (
              <div 
                key={idx}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                  isCorrect ? 'bg-success-bg border-success text-green-700' : 'bg-error-bg border-error text-red-700'
                }`}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <button 
          onClick={() => navigate(`/levels/${categoryId || 'science'}`)}
          className="btn-primary py-3 px-6 text-sm flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Play Another Round
        </button>
        <button 
          onClick={() => navigate('/categories')}
          className="bg-gray-200 text-text-primary hover:bg-gray-300 font-medium py-3 px-6 rounded-lg text-sm transition-colors"
        >
          Back to Categories
        </button>
      </div>
    </div>
  );
}
