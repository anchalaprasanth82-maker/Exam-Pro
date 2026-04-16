import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { UserPlus, User, Mail, Key, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    const result = await register(name, email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md glass-card p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <UserPlus className="text-blue-500" /> Join ExamPortal
          </h1>
          <p className="text-slate-500 mt-2">Start your journey today.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 italic">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
           <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                className="input-field px-4"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                className="input-field px-4"
                placeholder="you@student.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                className="input-field px-4"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <UserPlus className="w-5 h-5" />}
            Register
          </button>
        </form>

        <div className="text-center text-sm text-slate-600 pt-4">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline font-medium">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
