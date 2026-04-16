import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { BookOpen, CheckCircle, Clock, ArrowRight, Loader2, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatToIST } from '../../utils/dateUtils';

const StudentDashboard = () => {
  const [stats, setStats] = useState({ totalTaken: 0, passed: 0, average: 0 });
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/attempts/my');
        const attempts = response.data.data;
        setRecentAttempts(attempts.slice(0, 5));
        const submittedAttempts = attempts.filter(a => a.status === 'submitted');
        const passed = submittedAttempts.filter(a => 
            a.total_marks > 0 && a.score !== null && 
            a.score >= (a.total_marks * (a.passing_score / 100))
        ).length;
        
        const totalTaken = attempts.length;
        const validAttempts = submittedAttempts.filter(a => a.total_marks > 0 && a.score !== null);
        const average = validAttempts.length > 0 
          ? (validAttempts.reduce((acc, curr) => acc + (curr.score / curr.total_marks), 0) / validAttempts.length * 100).toFixed(1) 
          : null;
        
        setStats({ totalTaken, passed, average });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 p-6 pt-24">
        <div className="max-w-6xl mx-auto space-y-8">
          <header>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Dashboard</h1>
            <p className="text-slate-500 mt-2">Welcome back! Here's an overview of your progress.</p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 flex items-center gap-4 group hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Exams Taken</p>
                <h2 className="text-2xl font-bold text-slate-900">{stats.totalTaken}</h2>
              </div>
            </div>

            <div className="glass-card p-6 flex items-center gap-4 group hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Passed Exams</p>
                <h2 className="text-2xl font-bold text-slate-900">{stats.passed}</h2>
              </div>
            </div>

            <div className="glass-card p-6 flex items-center gap-4 group hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Average Score</p>
                <h2 className="text-2xl font-bold text-slate-900">{stats.average !== null ? `${stats.average}%` : 'N/A'}</h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
                <Link to="/attempts" className="text-blue-500 hover:text-blue-600 font-medium text-sm flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-3">
                {recentAttempts.length > 0 ? recentAttempts.map((attempt) => (
                  <div key={attempt.id} className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{attempt.exam_title}</h4>
                        <p className="text-xs text-slate-500">Submitted on {formatToIST(attempt.submit_time)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">
                          {attempt.status === 'submitted' ? `${attempt.score ?? 0}/${attempt.total_marks}` : '--'}
                        </p>
                        <p className={`text-[10px] font-bold uppercase ${
                          attempt.status !== 'submitted' ? 'text-blue-500' :
                          (attempt.total_marks > 0 && attempt.score >= (attempt.total_marks * (attempt.passing_score / 100))) 
                            ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {attempt.status === 'submitted' 
                            ? (attempt.total_marks > 0 && attempt.score >= (attempt.total_marks * (attempt.passing_score / 100)) ? 'Passed' : 'Failed')
                            : 'In Progress'}
                        </p>
                      </div>
                      <Link to={`/result/${attempt.id}`} className="p-2 text-slate-400 group-hover:text-blue-500 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                )) : (
                  <div className="glass-card p-8 text-center text-slate-500 italic">
                    No attempts yet. Take your first exam!
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions / Recommendations */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
              <div className="glass-card p-4 space-y-3">
                <Link to="/exams" className="block p-4 border border-blue-100 bg-blue-50/50 rounded-xl hover:bg-blue-50 transition-colors group">
                  <h4 className="font-bold text-blue-700">Take an Exam</h4>
                  <p className="text-xs text-blue-600 mt-1 opacity-80">Browse available courses and certifications</p>
                </Link>
                <Link to="/leaderboard/1" className="block p-4 border border-violet-100 bg-violet-50/50 rounded-xl hover:bg-violet-50 transition-colors group">
                  <h4 className="font-bold text-violet-700">Leaderboards</h4>
                  <p className="text-xs text-violet-600 mt-1 opacity-80">See how you rank against other students</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
