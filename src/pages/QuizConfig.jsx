import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';

export default function QuizConfig() {
  const { categoryId, levelId } = useParams();
  const navigate = useNavigate();
  
  const categoryName = categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : 'Science';
  const levelName = levelId ? levelId.charAt(0).toUpperCase() + levelId.slice(1) : 'Hard';

  const [questionCount, setQuestionCount] = useState('10');
  const [timeLimit, setTimeLimit] = useState('15 min');

  const startQuiz = () => {
    navigate(`/quiz/${categoryId}/${levelId}`, { 
      state: { questionCount: questionCount === 'Custom' ? 10 : parseInt(questionCount) } 
    });
  };

  return (
    <div className="container py-12 animate-fade-in flex flex-col items-center">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm">
            <Settings size={20} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Quiz Configuration</h1>
        </div>
        <p className="text-secondary text-lg">
          Customize your session for {categoryName} - {levelName}
        </p>
      </div>

      <div className="bg-surface border p-8 rounded-xl shadow-sm w-full max-w-3xl">
        <div className="mb-8">
          <label className="block text-sm font-bold text-text-primary mb-4">Question Count</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['10', '20', '50', 'Custom'].map(opt => (
              <button
                key={opt}
                onClick={() => setQuestionCount(opt)}
                className={`py-3 px-4 rounded-lg border font-medium transition-colors ${
                  questionCount === opt 
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-surface border-border-color text-text-secondary hover:border-gray-400'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <label className="block text-sm font-bold text-text-primary mb-4">Time Limit</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['5 min', '15 min', '30 min', 'No Limit'].map(opt => (
              <button
                key={opt}
                onClick={() => setTimeLimit(opt)}
                className={`py-3 px-4 rounded-lg border font-medium transition-colors ${
                  timeLimit === opt 
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-surface border-border-color text-text-secondary hover:border-gray-400'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t pt-8">
          <button 
            onClick={startQuiz}
            className="w-full btn-primary py-4 text-lg mb-4 shadow-sm"
          >
            Start Quiz
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            className="w-full text-secondary text-sm font-bold py-2 hover:text-text-primary transition-colors"
          >
            Back to Level Selection
          </button>
        </div>
      </div>
    </div>
  );
}
