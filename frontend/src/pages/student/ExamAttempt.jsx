import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Timer from '../../components/Timer';
import QuestionPalette from '../../components/QuestionPalette';
import MCQQuestion from '../../components/MCQQuestion';
import ShortAnswer from '../../components/ShortAnswer';
import CodingQuestion from '../../components/CodingQuestion';
import api from '../../services/api';
import { Loader2, ChevronLeft, ChevronRight, Send, AlertTriangle, Save } from 'lucide-react';

const ExamAttempt = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const answersRef = useRef(answers);
  const attemptIdRef = useRef(attemptId);

  useEffect(() => {
    answersRef.current = answers;
    attemptIdRef.current = attemptId;
  }, [answers, attemptId]);

  useEffect(() => {
    const initExam = async () => {
      try {
        // Try to resume first
        let data;
        try {
            const resumeRes = await api.get(`/attempts/resume/${examId}`);
            data = resumeRes.data.data;
        } catch (e) {
            // If resume fails, try starting fresh
            const startRes = await api.post('/attempts/start', { exam_id: examId });
            data = startRes.data.data;
        }
        
        if (data) {
          const { attempt_id, questions, answers: savedAnswers, time_remaining } = data;
          setAttemptId(attempt_id);
          setQuestions(questions);
          setTimeRemaining(time_remaining);
          
          if (savedAnswers) {
            const answerMap = {};
            savedAnswers.forEach(a => answerMap[a.question_id] = a.answer);
            setAnswers(answerMap);
          }
        }
      } catch (error) {
        console.error('Failed to initialize exam:', error);
        const msg = error.response?.data?.message || 'Failed to initialize exam. Please ensure the exam is still active and you have permission to start.';
        alert(msg);
        navigate('/exams');
      } finally {
        setLoading(false);
      }
    };
    initExam();
  }, [examId, navigate]);

  // Auto-save logic
  useEffect(() => {
    if (!attemptId) return;

    const interval = setInterval(async () => {
      const currentQuestionId = questions[currentIdx]?.id;
      const currentAnswer = answersRef.current[currentQuestionId];

      if (currentAnswer !== undefined) {
        setIsSaving(true);
        try {
          await api.post('/answers/save', {
            attempt_id: attemptIdRef.current,
            question_id: currentQuestionId,
            answer: currentAnswer
          });
        } catch (error) {
          console.error('Auto-save failed', error);
        } finally {
          setTimeout(() => setIsSaving(false), 500);
        }
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(interval);
  }, [attemptId, questions, currentIdx]);

  const handleAnswerChange = (val) => {
    if (!questions[currentIdx]) return;
    setAnswers(prev => ({
      ...prev,
      [questions[currentIdx].id]: val
    }));
  };

  const handleToggleFlag = (id) => {
    setFlaggedQuestions(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.post('/attempts/submit', { attempt_id: attemptId });
      navigate(`/result/${attemptId}`);
    } catch (error) {
      alert('Failed to submit exam');
      setLoading(false);
    }
  };

  if (!questions || questions.length === 0) {
    if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500" />
        <h2 className="text-xl font-bold">Unable to Load Exam</h2>
        <p className="text-slate-500">The exam data is currently unavailable or your attempt has ended.</p>
        <button onClick={() => navigate('/exams')} className="btn-primary bg-blue-600">Back to Exams</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Send className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Certification Exam</h2>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">{questions.length} Questions Total</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            {isSaving ? (
              <span className="flex items-center gap-1.5 text-blue-500 anim-fade-in-out">
                <Save className="w-4 h-4" /> Saving Progress...
              </span>
            ) : (
              <span className="flex items-center gap-1.5 opacity-40">
                <Save className="w-4 h-4" /> Changes Saved
              </span>
            )}
          </div>
          <Timer timeRemaining={timeRemaining} onTimeUp={handleSubmit} />
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <div className="glass-card p-8 min-h-[500px] flex flex-col">
             {currentQuestion?.type === 'MCQ' && (
                <MCQQuestion 
                    question={currentQuestion} 
                    savedAnswer={answers[currentQuestion.id]} 
                    onChange={handleAnswerChange}
                />
             )}
             {currentQuestion?.type === 'SHORT' && (
                <ShortAnswer 
                    question={currentQuestion} 
                    savedAnswer={answers[currentQuestion.id]} 
                    onChange={handleAnswerChange}
                />
             )}
             {currentQuestion?.type === 'CODING' && (
                <CodingQuestion 
                    question={currentQuestion} 
                    savedAnswer={answers[currentQuestion.id]} 
                    onChange={handleAnswerChange}
                />
             )}
          </div>

          <div className="flex items-center justify-between">
            <button 
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="btn-primary bg-white !text-slate-700 border border-slate-200 hover:border-slate-300 disabled:opacity-40 flex items-center gap-2"
            >
                <ChevronLeft className="w-4 h-4" /> Previous Question
            </button>

            <div className="flex items-center gap-4">
               {currentIdx === questions.length - 1 ? (
                   <button 
                    onClick={() => setShowConfirm(true)}
                    className="btn-primary bg-blue-600 hover:bg-blue-700 px-8 flex items-center gap-2 shadow-lg shadow-blue-100"
                   >
                    Submit Exam <Send className="w-4 h-4" />
                   </button>
               ) : (
                   <button 
                    onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                    className="btn-primary bg-slate-900 hover:bg-black px-8 flex items-center gap-2"
                   >
                    Next Question <ChevronRight className="w-4 h-4" />
                   </button>
               )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 space-y-6">
           <QuestionPalette 
                questions={questions}
                answers={answers}
                currentIdx={currentIdx}
                onSelect={setCurrentIdx}
                flaggedQuestions={flaggedQuestions}
                onToggleFlag={handleToggleFlag}
           />
           
           <div className="glass-card p-5 bg-blue-50/30 border-blue-100 space-y-4">
              <div className="flex items-center gap-3 text-blue-700">
                 <AlertTriangle className="w-5 h-5" />
                 <h4 className="font-bold text-sm">Exam Instructions</h4>
              </div>
              <ul className="text-xs text-blue-600 space-y-2 font-medium">
                 <li>• Do not refresh or exit the page.</li>
                 <li>• Progress is saved automatically.</li>
                 <li>• Ensure stable internet connection.</li>
                 <li>• Exam will auto-submit when timer hits zero.</li>
              </ul>
           </div>
        </aside>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center space-y-6 animate-scale-in">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <Send className="w-8 h-8 -rotate-45" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Finish Exam?</h3>
                    <p className="text-slate-500 mt-2">Are you sure you want to submit? You still have time left.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 flex justify-between text-sm font-bold text-slate-600">
                    <span>Answered</span>
                    <span className="text-green-600">{Object.keys(answers).length} / {questions.length}</span>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold border border-blue-700 shadow-lg shadow-blue-100">
                        Yes, Submit
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ExamAttempt;
