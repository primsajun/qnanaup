import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StopCircle, RotateCcw, CheckCircle2, XCircle, Lightbulb, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function ActiveQuiz() {
  const { category, level } = useParams();
  const navigate = useNavigate();
  
  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Science';
  const levelName = level ? level.charAt(0).toUpperCase() + level.slice(1) : 'Expert';

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(100);
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats to pass to completion page
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, breakdown: [] });
  // Local session streak for fun animations
  const [sessionStreak, setSessionStreak] = useState(0);

  useEffect(() => {
    fetchQuestions();

    // Prevent browser back button
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = () => {
      alert("Wanna go out? Click the STOP button!");
      window.history.pushState(null, null, window.location.pathname);
    };
    
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [category, level]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Fetch all unanswered questions (up to 1000 to get everything)
      const { data, error: rpcError } = await supabase.rpc('get_unanswered_questions', {
        p_user_id: session.user.id,
        p_category: categoryName,
        p_level: levelName,
        p_limit: 1000
      });

      if (rpcError) throw rpcError;
      
      // Also get the exact total question count for this category/level
      const { count } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('category', categoryName)
        .eq('level', levelName);

      // Shuffle the options for every question so the correct answer isn't always first
      const shuffledData = (data || []).map(q => {
        const optionsWithMetadata = q.options.map((text, idx) => ({
          text,
          isCorrect: idx === q.correct_answer_index
        }));
        
        // Fisher-Yates shuffle
        for (let i = optionsWithMetadata.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [optionsWithMetadata[i], optionsWithMetadata[j]] = [optionsWithMetadata[j], optionsWithMetadata[i]];
        }
        
        return {
          ...q,
          options: optionsWithMetadata.map(opt => opt.text),
          correct_answer_index: optionsWithMetadata.findIndex(opt => opt.isCorrect)
        };
      });

      setTotalQuestions(count || 100);
      setQuestions(shuffledData);
      setCurrentIndex(0);
      setShowFeedback(false);
      setSelectedOption(null);
      setSessionStreak(0);
    } catch (err) {
      console.error(err);
      setError("Failed to load questions. Make sure your database functions are set up.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = async () => {
    if (!window.confirm("Are you sure? This will delete all your progress for this level and start you over from Question 1.")) return;
    
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      await supabase.rpc('reset_level_progress', {
        p_user_id: session.user.id,
        p_category: categoryName,
        p_level: levelName
      });
      
      // Reset local stats
      setStats({ correct: 0, incorrect: 0, breakdown: [] });
      setSessionStreak(0);
      
      // Refetch all questions (will be 100 again)
      await fetchQuestions();
    } catch (err) {
      console.error("Failed to reset:", err);
      setError("Failed to reset progress.");
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

        // Also ensure the streak is logged permanently, even if they restart!
        const today = new Date().toISOString().split('T')[0];
        await supabase.from('streaks_log').upsert({
          user_id: session.user.id,
          activity_date: today
        }, { onConflict: 'user_id,activity_date' });
      }

      // Update local stats
      setStats(prev => ({
        ...prev,
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (!isCorrect ? 1 : 0),
        breakdown: [...prev.breakdown, isCorrect]
      }));
      
      setSessionStreak(prev => isCorrect ? prev + 1 : 0);

      // Show feedback
      setShowFeedback(true);
    } catch (err) {
      console.error("Failed to save answer:", err);
      // Still show feedback even if save failed, so user isn't stuck
      setShowFeedback(true); 
      setSessionStreak(prev => isCorrect ? prev + 1 : 0);
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
        navigate('/completed', { state: { stats } });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-color flex flex-col items-center justify-center font-sans">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <h2 className="text-xl font-bold">Fetching questions...</h2>
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
          You have answered all {totalQuestions} questions for {categoryName} ({levelName}). 
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('/categories')} className="btn-primary">Choose Another Topic</button>
          <button onClick={handleRestart} className="btn-outline">Restart Level</button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  
  // Calculate true progress (e.g. if they already answered 27, and they are on the 1st of the remaining 73, they are on question 28)
  const answeredCount = totalQuestions - questions.length;
  const trueQuestionNumber = answeredCount + currentIndex + 1;
  const progressPercent = (trueQuestionNumber / totalQuestions) * 100;
  
  const actualCorrectIndex = currentQ.correct_answer_index;
  const isSelectedCorrect = selectedOption === actualCorrectIndex;

  return (
    <div className="min-h-screen bg-bg-color flex flex-col font-sans">
      {/* Quiz Header */}
      <header className="bg-surface border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-secondary tracking-wider uppercase">
          <span className="text-primary">{categoryName}</span>
          <span className="text-gray-400">&gt;</span>
          <span>{levelName}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleRestart}
            className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-primary transition-colors border border-border-color px-3 py-1.5 rounded-md hover:border-primary bg-gray-50"
          >
            <RotateCcw size={16} />
            RESTART
          </button>
          <button 
            onClick={() => navigate('/categories')}
            className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-error transition-colors border border-border-color px-3 py-1.5 rounded-md hover:border-error bg-gray-50"
          >
            <StopCircle size={16} />
            STOP
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-12 px-4 relative">
        
        {/* Fun Popups! */}
        {showFeedback && isSelectedCorrect && sessionStreak > 0 && sessionStreak % 5 === 0 && (
          <div className="fixed bottom-10 right-10 z-50 animate-bounce">
            <img 
              src="https://media.tenor.com/tZ1Mh17zXIEAAAAi/minions-cheering.gif" 
              alt="Cheering Minions"
              className="w-48 h-48 drop-shadow-2xl"
            />
          </div>
        )}

        {showFeedback && !isSelectedCorrect && (
          <div className="fixed bottom-10 right-10 z-50 animate-pulse">
            <img 
              src="https://media.tenor.com/N6wT58FvIigAAAAi/minions-sad.gif" 
              alt="Sad Minion"
              className="w-48 h-48 drop-shadow-2xl opacity-90"
            />
          </div>
        )}

        <div className="w-full max-w-3xl z-10">
          
          {/* Progress */}
          <div className="flex justify-between text-xs font-bold text-secondary mb-2 uppercase tracking-wide">
            <span>{categoryName} • {levelName}</span>
            <span>Question {trueQuestionNumber} of {totalQuestions}</span>
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
