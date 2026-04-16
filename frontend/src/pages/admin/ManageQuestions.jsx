import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Upload, 
  Loader2, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ManageQuestions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exam, setExam] = useState(null);

  const [newQuestion, setNewQuestion] = useState({
    type: 'MCQ',
    question_text: '',
    correct_answer: '',
    explanation: '',
    marks: 1,
    options: ['', '', '', '']
  });

  const fetchQuestions = async () => {
    try {
      const qRes = await api.get(`/questions/exam/${examId}`);
      setQuestions(qRes.data.data);
      const eRes = await api.get(`/exams/${examId}`);
      setExam(eRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [examId]);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...newQuestion, exam_id: examId };
      if (newQuestion.type !== 'MCQ') delete payload.options;
      
      await api.post('/questions', payload);
      setShowAddForm(false);
      setNewQuestion({
        type: 'MCQ',
        question_text: '',
        correct_answer: '',
        explanation: '',
        marks: 1,
        options: ['', '', '', '']
      });
      fetchQuestions();
    } catch (error) {
      alert('Failed to add question');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/questions/${id}`);
      fetchQuestions();
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    
    setIsImporting(true);
    try {
      await api.post(`/questions/import/${examId}`, formData);
      fetchQuestions();
      alert('Questions imported successfully!');
    } catch (error) {
      alert('Import failed. Please check your Excel format.');
    } finally {
      setIsImporting(false);
    }
  };

  const handlePublish = async () => {
     try {
        await api.post(`/exams/${examId}/publish`);
        alert('Exam published successfully!');
        navigate('/admin');
     } catch (error) {
        alert('Publishing failed');
     }
  };

  if (loading && questions.length === 0) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 p-6 pt-24 text-slate-900">
        <div className="max-w-5xl mx-auto space-y-6">
          <Link to="/admin" className="text-slate-500 hover:text-blue-500 flex items-center gap-2 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Question Bank</h1>
              <p className="text-slate-500">Managing questions for: <span className="font-bold text-slate-800">{exam?.title}</span></p>
            </div>
            <div className="flex items-center gap-3">
               <label className="cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
                  {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Bulk Import
                  <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleImport} disabled={isImporting} />
               </label>
               <button onClick={handlePublish} className="btn-success flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Publish Exam
               </button>
            </div>
          </header>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-bold">Exam Questions ({questions.length})</h3>
                <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 text-blue-500 font-bold hover:bg-blue-50 px-4 py-2 rounded-xl transition-all"
                >
                    {showAddForm ? <ChevronUp className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {showAddForm ? 'Hide Form' : 'Add Question'}
                </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddQuestion} className="glass-card p-8 space-y-6 border-2 border-blue-500 shadow-xl shadow-blue-50 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Question Type</label>
                        <select 
                            className="input-field"
                            value={newQuestion.type}
                            onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value})}
                        >
                            <option value="MCQ">Multiple Choice (MCQ)</option>
                            <option value="SHORT">Short Answer</option>
                            <option value="CODING">Coding Challenge</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Question Summary</label>
                        <input 
                            type="text" 
                            required 
                            className="input-field"
                            placeholder="Briefly describe the question concept..."
                            value={newQuestion.question_text}
                            onChange={(e) => setNewQuestion({...newQuestion, question_text: e.target.value})}
                        />
                    </div>
                </div>

                {newQuestion.type === 'MCQ' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {newQuestion.options.map((opt, idx) => (
                            <div key={idx} className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400">Option {String.fromCharCode(65 + idx)}</label>
                                <input 
                                    className="input-field text-sm"
                                    value={opt}
                                    placeholder={`Choice ${idx + 1}`}
                                    onChange={(e) => {
                                        const newOpts = [...newQuestion.options];
                                        newOpts[idx] = e.target.value;
                                        setNewQuestion({...newQuestion, options: newOpts});
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Correct Answer</label>
                    {newQuestion.type === 'MCQ' ? (
                        <select 
                            className="input-field"
                            value={newQuestion.correct_answer}
                            onChange={(e) => setNewQuestion({...newQuestion, correct_answer: e.target.value})}
                            required
                        >
                            <option value="">Select Correct Option</option>
                            {newQuestion.options.map((opt, idx) => opt && (
                                <option key={idx} value={opt}>{opt}</option>
                            ))}
                        </select>
                    ) : (
                        <textarea 
                            className="input-field min-h-[100px]"
                            placeholder={newQuestion.type === 'CODING' ? 'Reference solution code...' : 'Exact expected response...'}
                            value={newQuestion.correct_answer}
                            onChange={(e) => setNewQuestion({...newQuestion, correct_answer: e.target.value})}
                            required
                        />
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Marks</label>
                        <input type="number" className="input-field" min="1" value={newQuestion.marks} onChange={(e) => setNewQuestion({...newQuestion, marks: parseInt(e.target.value)})}/>
                    </div>
                    <div className="flex items-end">
                        <button type="submit" className="w-full btn-primary h-[42px] flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" /> Save Question
                        </button>
                    </div>
                </div>
              </form>
            )}

            <div className="space-y-4 pt-4">
              {questions.map((q, idx) => (
                <div key={q.id} className="glass-card p-6 flex items-start justify-between group">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                      {idx + 1}
                    </div>
                    <div className="space-y-2">
                       <div className="flex items-center gap-3">
                        <span className="bg-slate-900 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
                            {q.type}
                        </span>
                        <span className="text-slate-400 text-[10px] font-bold uppercase">{q.marks} Marks</span>
                       </div>
                       <h4 className="font-bold text-slate-800 line-clamp-2">{q.question_text}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-blue-500"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(q.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              
              {questions.length === 0 && !showAddForm && (
                <div className="glass-card p-12 text-center text-slate-400 space-y-4">
                    <AlertCircle className="w-12 h-12 mx-auto opacity-20" />
                    <p className="font-medium italic">No questions added yet. Start by adding one manually or importing an Excel file.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageQuestions;
