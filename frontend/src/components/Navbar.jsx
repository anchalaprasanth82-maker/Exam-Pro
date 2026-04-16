import React from 'react';
import { useAuth } from '../context/authContext';
import { LogOut, User, Bell, Search, Hexagon } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Hexagon className="text-blue-500 w-8 h-8 fill-blue-50" />
        <span className="text-xl font-bold text-slate-900 tracking-tight">ExamPortal</span>
        {isAdmin && (
          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-bold rounded uppercase tracking-wider">
            Admin
          </span>
        )}
      </div>

      <div className="flex-1 max-w-lg mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search exams, results..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">{user?.name}</p>
            <p className="text-xs text-slate-500 mt-1 uppercase font-medium">{user?.role}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
            {user?.name?.[0]}
          </div>
          <button 
            onClick={logout}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
