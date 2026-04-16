import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { 
  History, 
  Search, 
  Calendar, 
  Trophy, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AttemptHistory = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await api.get('/attempts/my');
        setAttempts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch attempt history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  const filteredAttempts = attempts.filter(a => 
    a.exam_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 p-6 pt-24 text-slate-900">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Attempt History</h1>
                <p className="text-slate-500 mt-2">Track your progress and review past exam results.</p>
             </div>
             <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                   type="text" 
                   placeholder="Filter by exam title..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
             </div>
          </header>

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-slate-500 font-medium italic">Loading your history...</p>
              </div>
            ) : filteredAttempts.length > 0 ? (
              filteredAttempts.map((attempt) => {
                const isPassed = attempt.score >= (attempt.total_marks * (attempt.passing_score / 100));
                
                return (
                  <div key={attempt.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-200 transition-all hover:bg-white cursor-default group">
                    <div className="flex items-center gap-4">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isPassed ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {isPassed ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
                       </div>
                       <div>
                          <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors uppercase italic">{attempt.exam_title}</h3>
                          <div className="flex items-center gap-4 mt-1 text-slate-400 text-xs font-bold uppercase tracking-wider">
                             <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(attempt.start_time).toLocaleDateString()}</span>
                             <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {attempt.status}</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-8 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="text-center">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Score</p>
                          <p className={`text-xl font-black ${isPassed ? 'text-green-600' : 'text-red-500'}`}>
                             {attempt.score ?? 0}
                             <span className="text-sm opacity-30 font-bold ml-0.5">/ {attempt.total_marks ?? 0}</span>
                          </p>
                       </div>
                       <div className="h-8 w-px bg-slate-200"></div>
                       <div className="text-center">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Result</p>
                          <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             {isPassed ? 'Passed' : 'Failed'}
                          </span>
                       </div>
                    </div>

                    <div>
                       {attempt.status === 'submitted' ? (
                         <Link 
                           to={`/result/${attempt.id}`} 
                           className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg shadow-slate-200"
                         >
                            Review Details <ArrowRight className="w-4 h-4" />
                         </Link>
                       ) : (
                         <Link 
                           to={`/exam/attempt/${attempt.exam_id}`}
                           className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                         >
                            Resume Exam <ArrowRight className="w-4 h-4" />
                         </Link>
                       )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-20 text-center space-y-6 glass-card border-none bg-slate-100/30">
                 <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                    <History className="w-10 h-10" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold">No exam attempts found</h3>
                    <p className="text-slate-500 mt-1">Start your journey by enrolling in an available exam today.</p>
                 </div>
                 <Link to="/exams" className="inline-block btn-primary px-8">Browse Exams</Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttemptHistory;
