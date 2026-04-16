import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { 
  Save, 
  ArrowLeft, 
  Clock, 
  Target, 
  Calendar,
  Loader2,
  CheckCircle,
  FileText
} from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const CreateExam = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    duration: 60,
    passing_score: 60,
    start_time: '',
    end_time: ''
  });

  useEffect(() => {
    if (isEdit) {
      const fetchExam = async () => {
        try {
          const response = await api.get(`/exams/${id}`);
          const exam = response.data.data;
          setFormData({
            title: exam.title,
            duration: exam.duration,
            passing_score: exam.passing_score,
            start_time: new Date(exam.start_time).toISOString().slice(0, 16),
            end_time: new Date(exam.end_time).toISOString().slice(0, 16)
          });
        } catch (error) {
          console.error('Failed to fetch exam', error);
        } finally {
          setLoading(false);
        }
      };
      fetchExam();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/exams/${id}`, formData);
      } else {
        const response = await api.post('/exams', formData);
        const newId = response.data.data.id;
        navigate(`/admin/questions/${newId}`);
        return;
      }
      navigate('/admin');
    } catch (error) {
      alert('Failed to save exam');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 p-6 pt-24 text-slate-900">
        <div className="max-w-3xl mx-auto space-y-6">
          <Link to="/admin" className="text-slate-500 hover:text-blue-500 flex items-center gap-2 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                  <FileText className="w-8 h-8" />
               </div>
               <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">{isEdit ? 'Edit Exam' : 'Create New Certification'}</h1>
                  <p className="text-slate-500">Define the core settings for your examination.</p>
               </div>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-card p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">Exam Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced React Architecture"
                  className="input-field text-lg font-bold"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" /> Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="input-field"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" /> Passing Score (%)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    className="input-field"
                    value={formData.passing_score}
                    onChange={(e) => setFormData({...formData, passing_score: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500" /> Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className="input-field"
                    value={formData.start_time}
                    onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-500" /> End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className="input-field"
                    value={formData.end_time}
                    onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
               <Link to="/admin" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                  Discard Changes
               </Link>
               <button 
                type="submit" 
                disabled={submitting}
                className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 disabled:bg-blue-300"
               >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {isEdit ? 'Update Settings' : 'Continue to Questions'}
               </button>
            </div>
          </form>

          {isEdit && (
            <div className="glass-card p-6 border-l-4 border-l-blue-500 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">Manage Exam Questions</p>
                        <p className="text-xs text-slate-500">Add, edit or import questions for this exam.</p>
                    </div>
                </div>
                <Link to={`/admin/questions/${id}`} className="text-blue-500 font-bold text-sm hover:underline">
                    Edit Questions →
                </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateExam;
