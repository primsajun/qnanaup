import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Timer, X, CheckCircle2, XCircle, Lightbulb, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function ActiveQuiz() {
  const { categoryId, levelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get question count from route state, default to 10
  const requestedCount = location.state?.questionCount || 10;
  
  const categoryName = categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : 'Science';
  const levelName = levelId ? levelId.charAt(0).toUpperCase() + levelId.slice(1) : 'Expert';

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats to pass to completion page
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, breakdown: [] });

  useEffect(() => {
    fetchQuestions();
  }, [categoryId, levelId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error: rpcError } = await supabase.rpc('get_unanswered_questions', {
        p_user_id: session.user.id,
        p_category: categoryName,
        p_level: levelName,
        p_limit: requestedCount
      });

      if (rpcError) throw rpcError;
      
      setQuestions(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load questions. Make sure your database functions are set up.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (index) => {
    if (showFeedback) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null || showFeedback || isSubmitting) return;
    
    setIsSubmitting(true);
    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correct_answer_index;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Record the answer silently in the background
        await supabase.from('user_answers').insert({
          user_id: session.user.id,
          question_id: currentQ.id,
          is_correct: isCorrect
        });
      }

      // Update local stats
      setStats(prev => ({
        ...prev,
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (!isCorrect ? 1 : 0),
        breakdown: [...prev.breakdown, isCorrect]
      }));

      // Show feedback
      setShowFeedback(true);
    } catch (err) {
      console.error("Failed to save answer:", err);
      // Still show feedback even if save failed, so user isn't stuck
      setShowFeedback(true); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!showFeedback) {
      handleSubmitAnswer();
    } else {
      if (currentIndex < questions.length - 1) {
        // Move to next question
        setCurrentIndex(prev => prev + 1);
        setShowFeedback(false);
        setSelectedOption(null);
      } else {
        // Complete quiz
        navigate('/quiz-complete', { state: { stats } });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-color flex flex-col items-center justify-center font-sans">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <h2 className="text-xl font-bold">Fetching fresh questions...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-color flex flex-col items-center justify-center font-sans p-6 text-center">
        <XCircle size={48} className="text-error mb-4" />
        <h2 className="text-xl font-bold mb-2">Oops!</h2>
        <p className="text-secondary max-w-md">{error}</p>
        <button onClick={() => navigate(-1)} className="mt-8 btn-primary">Go Back</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-bg-color flex flex-col items-center justify-center font-sans p-6 text-center">
        <CheckCircle2 size={64} className="text-success mb-6" />
        <h2 className="text-3xl font-bold mb-4">You are a Master!</h2>
        <p className="text-secondary text-lg max-w-md mb-8">
          You have answered all available questions for {categoryName} ({levelName}). There are no new questions left for you to practice here.
        </p>
        <button onClick={() => navigate('/categories')} className="btn-primary">Choose Another Topic</button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const actualCorrectIndex = currentQ.correct_answer_index;
  const isSelectedCorrect = selectedOption === actualCorrectIndex;

  return (
    <div className="min-h-screen bg-bg-color flex flex-col font-sans">
      {/* Quiz Header */}
      <header className="bg-surface border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 text-xs font-bold text-secondary tracking-wider uppercase">
          <span className="text-primary">{categoryName}</span>
          <span className="text-gray-400">&gt;</span>
          <span>{levelName}</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm font-semibold">
            <Timer size={16} />
            --:--
          </div>
          <button 
            onClick={() => navigate('/categories')}
            className="flex items-center gap-2 text-xs font-bold text-secondary hover:text-text-primary transition-colors"
          >
            <X size={16} />
            EXIT QUIZ
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-3xl">
          
          {/* Progress */}
          <div className="flex justify-between text-xs font-bold text-secondary mb-2 uppercase tracking-wide">
            <span>{categoryName} • {levelName}</span>
            <span>Question {currentIndex + 1} of {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full mb-8 flex overflow-hidden">
            <div className="bg-primary h-full transition-all duration-300 ease-out" style={{ width: `${progressPercent}%` }}></div>
          </div>

          <div className="bg-surface border p-8 rounded-xl shadow-sm relative">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 leading-snug">
              {currentQ.question_text}
            </h1>

            {showFeedback && (
              <div className={`border p-4 rounded-lg mb-6 flex flex-col animate-fade-in ${
                isSelectedCorrect ? 'bg-success-bg border-success text-green-800' : 'bg-error-bg border-error text-error'
              }`}>
                <div className="flex items-center gap-2 font-bold mb-1">
                  {isSelectedCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  {isSelectedCorrect ? 'Correct!' : 'Incorrect'}
                </div>
                {!isSelectedCorrect && (
                  <div className="text-sm ml-6">You selected the wrong answer.</div>
                )}
              </div>
            )}

            <div className="space-y-4 mb-8">
              {currentQ.options.map((opt, idx) => {
                let btnClass = "bg-surface border-border-color text-text-primary hover:border-gray-400";
                let isThisSelected = selectedOption === idx;
                let isThisCorrect = actualCorrectIndex === idx;

                if (!showFeedback && isThisSelected) {
                  btnClass = "border-primary bg-blue-50/50";
                } else if (showFeedback) {
                  if (isThisCorrect) {
                    btnClass = "border-success bg-success-bg text-green-900";
                  } else if (isThisSelected && !isThisCorrect) {
                    btnClass = "border-error bg-error-bg text-red-800";
                  } else {
                    btnClass = "opacity-60 cursor-not-allowed border-gray-200";
                  }
                }

                return (
                  <button 
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 rounded-lg border flex items-center gap-4 transition-colors ${btnClass}`}
                  >
                    {showFeedback && isThisCorrect ? (
                      <CheckCircle2 size={20} className="text-success flex-shrink-0" />
                    ) : showFeedback && isThisSelected && !isThisCorrect ? (
                      <XCircle size={20} className="text-error flex-shrink-0" />
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${!showFeedback && isThisSelected ? 'border-primary' : 'border-gray-300'}`}>
                        {!showFeedback && isThisSelected && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                      </div>
                    )}
                    
                    <span className="font-medium flex-1">{opt}</span>
                    
                    {!showFeedback && isThisSelected && <CheckCircle2 size={18} className="text-primary" />}
                    {showFeedback && isThisSelected && !isThisCorrect && <X size={18} className="text-error" />}
                  </button>
                );
              })}
            </div>

            {showFeedback && currentQ.explanation && (
              <div className="bg-gray-100 p-6 rounded-lg mb-8 animate-fade-in border">
                <div className="flex items-center gap-2 font-bold text-text-primary mb-2">
                  <Lightbulb size={18} className="text-primary" />
                  Explanation
                </div>
                <p className="text-secondary text-sm leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end border-t pt-6">
              <button 
                onClick={handleNext}
                disabled={selectedOption === null || isSubmitting}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                {showFeedback ? (currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question') : 'Submit Answer'}
                {!isSubmitting && <ArrowRight size={16} />}
              </button>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
