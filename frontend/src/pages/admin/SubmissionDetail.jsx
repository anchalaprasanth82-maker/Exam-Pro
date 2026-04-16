import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Clock, 
  User, 
  Mail, 
  Download, 
  Loader2, 
  Award,
  ChevronLeft
} from 'lucide-react';

const SubmissionDetail = () => {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await api.get(`/admin/submissions/${attemptId}`);
        setResult(response.data.data);
      } catch (error) {
        console.error('Failed to fetch submission details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;
  if (!result) return <div className="flex flex-col items-center justify-center h-screen space-y-4">
    <p className="text-xl font-bold text-slate-400 italic">Submission not found or access denied.</p>
    <Link to="/admin" className="text-blue-500 hover:underline flex items-center gap-2">
      <ChevronLeft className="w-4 h-4" /> Back to Dashboard
    </Link>
  </div>;

  const scorePercentage = (result.score / result.total_marks) * 100;
  const isPassed = scorePercentage >= result.passing_score;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 p-6 pt-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="flex items-center justify-between">
             <Link to="/admin" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-sm uppercase tracking-widest">
                <ChevronLeft className="w-4 h-4" /> Back to stats
             </Link>
             <button onClick={() => window.print()} className="btn-primary bg-white !text-slate-700 border border-slate-200 flex items-center gap-2">
                <Download className="w-4 h-4" /> Print Report
             </button>
          </header>

          <section className={`glass-card p-10 text-center relative overflow-hidden border-t-8 ${isPassed ? 'border-green-500' : 'border-red-500'}`}>
            <div className={`absolute top-0 right-0 p-8 opacity-5 ${isPassed ? 'text-green-500' : 'text-red-500'}`}>
                {isPassed ? <Award size={120} /> : <XCircle size={120} />}
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isPassed ? <Trophy className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                 </div>
                 <h1 className="text-3xl font-black italic">{result.exam_title}</h1>
                 <p className="text-slate-500 font-medium">Performance report for submission ID: <span className="text-slate-800 font-bold">#{result.id}</span></p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-6 border-y border-slate-100">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                       <User className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</p>
                       <p className="font-bold">{result.student_name}</p>
                    </div>
                 </div>
                 <div className="hidden md:block w-px h-10 bg-slate-100"></div>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                       <Mail className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                       <p className="font-bold">{result.student_email}</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Raw Score</p>
                  <p className="text-2xl font-black text-slate-900">{result.score}/{result.total_marks}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Percentage</p>
                  <p className="text-2xl font-black text-slate-900">{scorePercentage.toFixed(1)}%</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className={`text-2xl font-black ${isPassed ? 'text-green-600' : 'text-red-600'}`}>{isPassed ? 'PASS' : 'FAIL'}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-lg font-black text-slate-900 leading-tight">{new Date(result.submit_time).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="glass-card p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                   <Clock className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Submission Info</p>
                   <p className="font-semibold text-slate-800 italic">
                      {result.auto_submitted ? 'Timed out (Auto-submitted)' : 'Submitted manually'}
                   </p>
                </div>
             </div>
             <div className="glass-card p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                   <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Validation</p>
                   <p className="font-semibold text-slate-800 italic">Integrity Check Passed</p>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmissionDetail;
