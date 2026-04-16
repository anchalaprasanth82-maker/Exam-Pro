import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/authContext';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  LogOut,
  Save,
  Camera
} from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 p-6 pt-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <header>
             <h1 className="text-3xl font-extrabold tracking-tight italic flex items-center gap-3">
                <SettingsIcon className="text-slate-400 w-8 h-8" /> 
                Account Settings
             </h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Profile Preview */}
             <div className="md:col-span-1 space-y-6">
                <div className="glass-card p-6 text-center">
                   <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-black italic">
                         {user?.name.charAt(0)}
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-slate-100 hover:text-blue-600 transition-colors">
                         <Camera className="w-4 h-4" />
                      </button>
                   </div>
                   <h2 className="text-xl font-bold">{user?.name}</h2>
                   <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">{user?.role}</p>
                   <div className="mt-6 pt-6 border-t border-slate-100">
                      <button 
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
                      >
                         <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                   </div>
                </div>
             </div>

             {/* Settings Forms */}
             <div className="md:col-span-2 space-y-6">
                <section className="glass-card p-8">
                   <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                       <User className="w-5 h-5 text-blue-500" /> Personal Information
                   </h3>
                   <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-1.5">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                         <input 
                            type="text" 
                            defaultValue={user?.name}
                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 font-medium"
                         />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                         <input 
                            type="email" 
                            defaultValue={user?.email}
                            disabled
                            className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-slate-500 cursor-not-allowed font-medium"
                         />
                      </div>
                   </div>
                   <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                      <button className="btn-primary flex items-center gap-2 shadow-lg shadow-blue-200">
                         <Save className="w-4 h-4" /> Save Changes
                      </button>
                   </div>
                </section>

                <section className="glass-card p-8 italic opacity-50 pointer-events-none">
                   <h3 className="text-lg font-bold mb-6 flex items-center gap-2 not-italic">
                       <Shield className="w-5 h-5 text-indigo-500" /> Security Settings
                   </h3>
                   <p className="text-sm font-medium text-slate-500">Security preferences are currently managed by organization policy.</p>
                </section>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
