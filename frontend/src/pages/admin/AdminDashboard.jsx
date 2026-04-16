import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { 
  Users, 
  BookOpen, 
  Send, 
  ArrowRight, 
  BarChart3, 
  TrendingUp,
  Clock,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 p-6 pt-24 text-slate-900">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Admin Command Center</h1>
              <p className="text-slate-500 mt-2">Scale and manage your online examination platform.</p>
            </div>
            <div className="flex items-center gap-3">
               <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
                  <BarChart3 className="w-4 h-4" /> Export All Data
               </button>
               <Link to="/admin/exams/create" className="btn-primary flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Create New Exam
               </Link>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 bg-blue-600 text-white shadow-xl shadow-blue-100 overflow-hidden relative">
               <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10" />
               <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Total Exams</p>
               <h2 className="text-4xl font-black">{stats.totalExams}</h2>
               <div className="mt-4 flex items-center gap-2 text-blue-200 text-xs font-medium">
                  <span className="bg-blue-500/50 px-2 py-0.5 rounded">+2 this week</span>
                  <span>Active platform growth</span>
               </div>
            </div>

            <div className="glass-card p-6 border-l-4 border-l-green-500">
               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Students</p>
               <h2 className="text-4xl font-black">{stats.totalStudents}</h2>
               <div className="mt-4 flex items-center gap-2 text-green-600 text-xs font-bold">
                  <Users className="w-4 h-4" /> 
                  <span>Active enrollments</span>
               </div>
            </div>

            <div className="glass-card p-6 border-l-4 border-l-indigo-500">
               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Submissions</p>
               <h2 className="text-4xl font-black">{stats.totalSubmissions}</h2>
               <div className="mt-4 flex items-center gap-2 text-indigo-600 text-xs font-bold">
                  <CheckCircle className="w-4 h-4" /> 
                  <span>Awaiting review</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Submissions */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Clock className="text-blue-500" /> Recent Submissions
                </h3>
                <button className="text-sm font-bold text-blue-500 hover:underline">View All</button>
              </div>
              
              <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Exam</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 italic">
                    {stats.recentSubmissions.length > 0 ? stats.recentSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="font-bold text-slate-900 not-italic">{sub.name}</span>
                              <span className="text-[10px] text-slate-400 not-italic">{new Date(sub.submit_time).toLocaleDateString()}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="font-medium text-slate-700 not-italic">{sub.title}</span>
                        </td>
                        <td className="px-6 py-4">
                           <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-600 not-italic">
                             {sub.score} / {sub.total_marks}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Link to={`/admin/reports/${sub.id}`} className="p-2 text-slate-400 hover:text-blue-500 transition-colors inline-block not-italic">
                              <ArrowRight className="w-5 h-5" />
                           </Link>
                        </td>
                      </tr>
                    )) : (
                        <tr><td colSpan="4" className="p-12 text-center text-slate-400">No recent submissions found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Management */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 px-2">
                  <BarChart3 className="text-violet-500" /> Management
              </h3>
              <div className="glass-card p-5 space-y-4">
                 <button className="w-full text-left p-4 border border-blue-50 bg-blue-50/20 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Manage Students</p>
                        <p className="text-[10px] text-slate-500">Add, remove or update roles</p>
                    </div>
                 </button>

                 <button className="w-full text-left p-4 border border-violet-50 bg-violet-50/20 rounded-xl hover:bg-violet-50 transition-colors flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-violet-500 group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Exam Reports</p>
                        <p className="text-[10px] text-slate-500">Generate PDF performance reports</p>
                    </div>
                 </button>

                 <div className="pt-4 mt-2 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Server Status</p>
                    <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-2 text-green-600">
                           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> DB Online
                        </span>
                        <span className="text-slate-400">v1.2.0-stable</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
