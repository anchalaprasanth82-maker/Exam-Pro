import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { BookOpen, Clock, Calendar, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api.get('/exams');
        setExams(response.data.data);
      } catch (error) {
        console.error('Failed to fetch exams', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleStartExam = (examId) => {
    navigate(`/exam/attempt/${examId}`);
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 p-6 pt-24">
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Available Exams</h1>
              <p className="text-slate-500 mt-2">Browse and enroll in available certification exams.</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {exams.length > 0 ? exams.map((exam) => (
              <div key={exam.id} className="glass-card flex flex-col group overflow-hidden hover:border-blue-300 transition-all">
                <div className="p-6 flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded tracking-wider">
                        Available
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {exam.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        Assess your skills in {exam.title}. This exam covers fundamental to intermediate concepts.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Clock className="w-4 h-4" />
                      {exam.duration} mins
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <AlertCircle className="w-4 h-4" />
                      {exam.passing_score}% to Pass
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <Calendar className="w-3 h-3" />
                    Ends {new Date(exam.end_time).toLocaleDateString()}
                  </div>
                  <button 
                    onClick={() => handleStartExam(exam.id)}
                    className="flex items-center gap-1 text-blue-500 font-bold text-sm hover:gap-2 transition-all"
                  >
                    Start Exam <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full glass-card p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <BookOpen className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">No exams available</h3>
                    <p className="text-slate-500">Check back later for new certifications.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamList;
