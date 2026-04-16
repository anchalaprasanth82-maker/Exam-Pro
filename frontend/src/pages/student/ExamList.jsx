import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { BookOpen, Clock, Calendar, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatToIST, formatDateOnlyIST } from '../../utils/dateUtils';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
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

  const handleStartExam = (exam) => {
    setSelectedExam(exam);
  };

  const confirmStart = () => {
    if (!selectedExam) return;
    const examId = selectedExam.id;
    setIsStarting(examId);
    setSelectedExam(null);
    setTimeout(() => {
        navigate(`/exam/attempt/${examId}`);
    }, 100);
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;

  // To ensure comparison is accurate regardless of local browser TZ, 
  // we treat all dates from the server as IST.
  const now = new Date();
  const parseAsIST = (dateStr) => {
    if (!dateStr) return new Date();
    // Append the IST offset if not present to force correct parsing
    return new Date(dateStr.replace(' ', 'T') + '+05:30');
  };

  const liveExams = exams.filter(e => parseAsIST(e.start_time) <= now);
  const upcomingExams = exams.filter(e => parseAsIST(e.start_time) > now);

  const ExamCard = ({ exam, isUpcoming }) => (
    <div key={exam.id} className={`glass-card flex flex-col group overflow-hidden transition-all ${isUpcoming ? 'opacity-90 grayscale-[0.3]' : 'hover:border-blue-300'}`}>
        <div className="p-6 flex-1 space-y-4">
            <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isUpcoming ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                    <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded tracking-wider ${isUpcoming ? 'bg-indigo-100 text-indigo-700' : 'bg-green-50 text-green-600'}`}>
                        {isUpcoming ? 'Upcoming' : 'Live Now'}
                    </span>
                </div>
            </div>

            <div>
                <h3 className={`text-lg font-bold transition-colors leading-tight ${isUpcoming ? 'text-slate-700' : 'text-slate-900 group-hover:text-blue-600'}`}>
                    {exam.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic">
                    {isUpcoming ? `Registration open. Exam starts at ${formatToIST(exam.start_time)}.` : `Assess your skills in ${exam.title}. Join now before it ends.`}
                </p>
            </div>

            <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                    <Clock className="w-4 h-4" />
                    {exam.duration} mins
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                    <AlertCircle className="w-4 h-4" />
                    {exam.passing_score}% Pass Mark
                </div>
            </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">
                <Calendar className="w-3 h-3" />
                {isUpcoming ? `Starts ${formatDateOnlyIST(exam.start_time)}` : `Ends ${formatDateOnlyIST(exam.end_time)}`}
            </div>
            {isUpcoming ? (
                <span className="text-xs font-bold text-slate-400 italic">Locked</span>
            ) : (
                <button 
                onClick={() => handleStartExam(exam)}
                disabled={isStarting !== null}
                className="flex items-center gap-1 text-blue-500 font-bold text-sm hover:gap-2 transition-all disabled:opacity-50"
                >
                {isStarting === exam.id ? (
                    <span className="flex items-center gap-2 italic">
                        Initializing... <Loader2 className="w-4 h-4 animate-spin" />
                    </span>
                ) : (
                    <>Start Exam <ChevronRight className="w-4 h-4" /></>
                )}
                </button>
            )}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 p-6 pt-24">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Live Exams Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
               <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                     <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                     Live Exams
                  </h1>
                  <p className="text-slate-500 mt-2">Active certifications you can start immediately.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {liveExams.length > 0 ? liveExams.map(exam => (
                   <ExamCard key={exam.id} exam={exam} isUpcoming={false} />
                )) : (
                   <div className="col-span-full glass-card p-12 text-center space-y-4">
                      <p className="text-slate-400 italic font-medium">No exams are currently live. Check the schedule below.</p>
                   </div>
                )}
            </div>
          </section>

          {/* Upcoming Schedule Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
               <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3 italic">
                     <Calendar className="text-indigo-500 w-6 h-6" />
                     Upcoming Schedule
                  </h2>
                  <p className="text-slate-500 mt-1">Get ready for these future examination dates.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {upcomingExams.length > 0 ? upcomingExams.map(exam => (
                   <ExamCard key={exam.id} exam={exam} isUpcoming={true} />
                )) : (
                   <div className="col-span-full border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                      <p className="text-slate-400 italic">No future exams scheduled at the moment.</p>
                   </div>
                )}
            </div>
          </section>

        </div>
      </main>

      {/* Start Confirmation Modal */}
      {selectedExam && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center space-y-6 animate-scale-in">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">{selectedExam.title}</h3>
                    <p className="text-slate-500 mt-2 text-sm">You are about to start this certification exam.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                      <p className="font-bold text-slate-700">{selectedExam.duration} Mins</p>
                   </div>
                   <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Passing Mark</p>
                      <p className="font-bold text-slate-700">{selectedExam.passing_score}%</p>
                   </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 flex gap-3 text-left">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <p className="text-xs text-amber-700 font-medium leading-relaxed">
                        Once you start, the <span className="font-bold">timer cannot be paused</span>. Ensure you have a stable connection.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={confirmStart} 
                        className="w-full px-4 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold border border-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
                    >
                        I'm Ready, Start Exam
                    </button>
                    <button 
                        onClick={() => setSelectedExam(null)} 
                        className="w-full px-4 py-3 bg-white hover:bg-slate-50 text-slate-500 rounded-xl font-bold transition-colors"
                    >
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ExamList;
