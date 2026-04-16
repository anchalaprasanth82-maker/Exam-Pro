import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { Trophy, Clock, Medal, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const { examId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get(`/leaderboard/${examId}`);
        setLeaderboard(response.data.data);
      } catch (error) {
        console.error('Failed to fetch leaderboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [examId]);

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;

  const getRankBadge = (rank) => {
    if (rank === 1) return <Medal className="text-yellow-500 w-6 h-6" />;
    if (rank === 2) return <Medal className="text-slate-400 w-6 h-6" />;
    if (rank === 3) return <Medal className="text-amber-600 w-6 h-6" />;
    return <span className="text-slate-400 font-bold w-6 text-center">{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 p-6 pt-24 text-slate-900">
        <div className="max-w-4xl mx-auto space-y-6">
          <Link to="/exams" className="text-slate-500 hover:text-blue-500 flex items-center gap-2 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Exams
          </Link>

          <header className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                <Trophy className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Hall of Fame</h1>
                <p className="text-slate-500">Top performers for this certification.</p>
            </div>
          </header>

          <div className="glass-card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rank</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Time Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaderboard.length > 0 ? leaderboard.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                        <div className="flex items-center justify-center w-8">
                            {getRankBadge(entry.rank)}
                        </div>
                    </td>
                    <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                {entry.name?.[0]}
                            </div>
                            <span className="font-bold text-slate-800">{entry.name}</span>
                        </div>
                    </td>
                    <td className="px-6 py-5">
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-slate-900">{entry.score}</span>
                            <span className="text-xs text-slate-400 font-bold">/ {entry.total_marks}</span>
                        </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-slate-500 font-mono text-sm font-bold">
                            <Clock className="w-3 h-3" />
                            {Math.floor(entry.time_taken / 60)}m {entry.time_taken % 60}s
                        </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic font-medium">
                        Competition hasn't started yet! Be the first to top the charts.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
