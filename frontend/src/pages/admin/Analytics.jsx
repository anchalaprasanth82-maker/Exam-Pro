import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 p-6 pt-24">
        <div className="max-w-6xl mx-auto space-y-8">
          <header>
             <h1 className="text-3xl font-extrabold tracking-tight italic flex items-center gap-3">
                <BarChart3 className="text-violet-500 w-8 h-8" /> 
                Platform Analytics
             </h1>
             <p className="text-slate-500 mt-2">Historical performance and student engagement insights.</p>
          </header>

          {/* Key Metric Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {[
               { label: 'Total Exams', value: data?.totalExams, icon: Layers, color: 'blue' },
               { label: 'Total Students', value: data?.totalStudents, icon: Users, color: 'indigo' },
               { label: 'Submissions', value: data?.totalSubmissions, icon: CheckCircle, color: 'green' },
               { label: 'Completion Rate', value: '87%', icon: TrendingUp, color: 'orange' }
             ].map((stat, i) => (
               <div key={i} className="glass-card p-6 border-b-4 border-b-slate-100 hover:border-b-blue-500 transition-all">
                  <div className={`w-10 h-10 rounded-lg bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-4`}>
                     <stat.icon className="w-5 h-5" />
                  </div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                  <div className="flex items-end justify-between mt-1">
                     <h2 className="text-3xl font-black">{stat.value}</h2>
                     <span className="text-green-500 text-xs font-bold flex items-center gap-0.5">
                        <ArrowUpRight className="w-3 h-3" /> 12%
                     </span>
                  </div>
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Engagement Chart Placeholder */}
             <div className="glass-card p-8 min-h-[300px] flex flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute top-6 left-6">
                   <h3 className="text-lg font-bold">Engagement Trends</h3>
                   <p className="text-xs text-slate-400">Student activity over the last 30 days</p>
                </div>
                <BarChart3 className="w-20 h-20 text-slate-100 mb-4" />
                <p className="text-slate-400 text-sm font-medium italic">Visualization module loading...</p>
             </div>

             {/* Recent Activity Summary */}
             <div className="glass-card p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                   <Calendar className="text-blue-500 w-5 h-5" /> Quick Insights
                </h3>
                <div className="space-y-6">
                   {[
                     { text: 'Peak activity recorded between 2 PM - 5 PM.', type: 'info' },
                     { text: 'MCQ questions have the highest accuracy rate (76%).', type: 'success' },
                     { text: 'Average time spent per exam: 42 minutes.', type: 'info' },
                     { text: '3 students pending manual code review.', type: 'warning' }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-4 items-start">
                        <div className={`w-1.5 h-10 rounded-full ${item.type === 'warning' ? 'bg-orange-400' : item.type === 'success' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                        <p className="text-sm font-medium text-slate-700 pt-0.5">{item.text}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
