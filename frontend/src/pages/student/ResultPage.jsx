import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { CheckCircle2, XCircle, Trophy, Clock, FileText, Download, Loader2, Award } from 'lucide-react';

const ResultPage = () => {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await api.get('/attempts/my');
        const attempts = response.data.data;
        const current = attempts.find(a => a.id === parseInt(attemptId));
        setResult(current);
      } catch (error) {
        console.error('Failed to fetch result', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;
  if (!result) return <div className="flex items-center justify-center h-screen">Result not found or Access Denied</div>;

  const scorePercentage = (result.score / result.total_marks) * 100;
  const isPassed = scorePercentage >= result.passing_score;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 p-6 pt-24 text-slate-900">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className={`glass-card p-10 text-center relative overflow-hidden border-t-8 ${isPassed ? 'border-green-500' : 'border-red-500'}`}>
            <div className={`absolute top-0 right-0 p-8 opacity-5 ${isPassed ? 'text-green-500' : 'text-red-500'}`}>
                {isPassed ? <Award size={120} /> : <XCircle size={120} />}
            </div>

            <div className="space-y-4 relative z-10">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {isPassed ? <Trophy className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                {isPassed ? 'Congratulations!' : 'Almost There!'}
              </h1>
              <p className="text-slate-500 max-w-sm mx-auto">
                You have completed the <span className="font-bold text-slate-800">{result.exam_title}</span> certification.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
                <p className="text-2xl font-black text-slate-900">{result.score}/{result.total_marks}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Percentage</p>
                <p className="text-2xl font-black text-slate-900">{scorePercentage.toFixed(1)}%</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className={`text-2xl font-black ${isPassed ? 'text-green-600' : 'text-red-600'}`}>{isPassed ? 'PASS' : 'FAIL'}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Passing Mark</p>
                <p className="text-2xl font-black text-slate-900">{result.passing_score}%</p>
              </div>
            </div>

            <div className="pt-8 flex flex-wrap items-center justify-center gap-4">
              <button 
                onClick={() => window.print()}
                className="btn-primary bg-slate-900 flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Certificate
              </button>
              <Link 
                to={`/leaderboard/${result.exam_id}`}
                className="btn-primary bg-white !text-slate-700 border border-slate-200 hover:border-slate-300 flex items-center gap-2"
              >
                <Trophy className="w-4 h-4 text-orange-500" /> View Leaderboard
              </Link>
            </div>
          </header>

          <section className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <FileText className="text-blue-500" /> Performance Analysis
            </h3>
            <div className="glass-card divide-y divide-slate-100 overflow-hidden">
                <div className="p-6 bg-slate-50/50 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase">Exam Date</p>
                        <p className="font-semibold text-slate-800">{new Date(result.submit_time).toLocaleString()}</p>
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase">Submission Mode</p>
                        <p className="font-semibold text-slate-800">{result.auto_submitted ? 'Auto-submitted' : 'Manual Submission'}</p>
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase">Exam Duration</p>
                        <p className="font-semibold text-slate-800">Available: 60:00</p>
                    </div>
                </div>
            </div>
          </section>

          <footer className="text-center pt-8">
            <Link to="/exams" className="text-blue-500 font-bold hover:underline">
                Take another exam
            </Link>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default ResultPage;
