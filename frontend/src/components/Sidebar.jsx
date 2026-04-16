import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  History, 
  Trophy, 
  Settings, 
  PlusCircle, 
  Users, 
  BarChart3,
  HelpCircle
} from 'lucide-react';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const studentLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/exams', icon: BookOpen, label: 'Available Exams' },
    { to: '/attempts', icon: History, label: 'Attempt History' },
    { to: '/leaderboard/1', icon: Trophy, label: 'Global Rank' }, // Placeholder examId
  ];

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
    { to: '/admin/exams/create', icon: PlusCircle, label: 'New Exam' },
    { to: '/admin/students', icon: Users, label: 'Students' },
    { to: '/admin/reports', icon: BarChart3, label: 'Analytics' },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-64px)] fixed left-0 top-16 hidden lg:flex flex-col p-4">
      <div className="space-y-1 flex-1">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Main Menu</p>
        
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
              ${isActive 
                ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }
            `}
          >
            <link.icon className={`w-5 h-5 transition-colors group-hover:scale-110 duration-200`} />
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-1">
        <NavLink
            to="/settings"
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
              ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}
            `}
          >
          <Settings className="w-5 h-5" />
          Settings
        </NavLink>
        <NavLink
            to="/help"
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
              ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}
            `}
          >
          <HelpCircle className="w-5 h-5" />
          Help & Support
        </NavLink>
      </div>
      
      <div className="mt-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 text-white">
        <p className="text-xs font-semibold opacity-70">Enrolled In</p>
        <p className="text-sm font-bold mt-1">Full Stack Mastery</p>
        <div className="w-full bg-white/20 h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="bg-blue-400 h-full w-2/3"></div>
        </div>
        <p className="text-[10px] mt-2 opacity-60">65% Progress Complete</p>
      </div>
    </aside>
  );
};

export default Sidebar;
