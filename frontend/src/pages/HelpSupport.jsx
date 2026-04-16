import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  BookOpen, 
  ChevronDown,
  ShieldCheck,
  Zap
} from 'lucide-react';

const HelpSupport = () => {
  const faqs = [
    {
      q: "How automated is the grading system?",
      a: "MCQs and Coding questions (via unit tests) are graded instantly. Short answers are evaluated based on keyword matching."
    },
    {
      q: "What happens if my connection drops during an exam?",
      a: "Our system auto-saves your progress every few seconds. You can resume exactly where you left off if you reconnect before the timer expires."
    },
    {
      q: "Can I retake an exam after submission?",
      a: "Retakes are only permitted if an Administrator grants you explicit permission. Contact support for such requests."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 p-6 pt-24">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
             <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto">
                <HelpCircle className="w-8 h-8" />
             </div>
             <h1 className="text-4xl font-extrabold tracking-tight italic">How can we help?</h1>
             <p className="text-slate-500 font-medium max-w-md mx-auto">Search our knowledge base or reach out to our team of experts.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { icon: MessageSquare, label: 'Live Chat', text: 'Chat with us 24/7', color: 'blue' },
               { icon: Mail, label: 'Email Support', text: 'support@quizapp.com', color: 'indigo' },
               { icon: BookOpen, label: 'Documentation', text: 'Browse our guides', color: 'violet' }
             ].map((box, i) => (
               <div key={i} className="glass-card p-6 text-center hover:scale-[1.02] transition-all cursor-pointer">
                  <box.icon className={`w-6 h-6 text-${box.color}-500 mx-auto mb-4`} />
                  <h3 className="font-bold">{box.label}</h3>
                  <p className="text-xs text-slate-400 mt-1">{box.text}</p>
               </div>
             ))}
          </div>

          <section className="space-y-6">
             <h2 className="text-2xl font-bold flex items-center gap-3">
                <Zap className="text-orange-500 w-6 h-6" /> 
                Frequently Asked Questions
             </h2>
             <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="glass-card p-6 group cursor-help">
                     <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-slate-800">{faq.q}</h4>
                        <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                     </div>
                     <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                        {faq.a}
                     </p>
                  </div>
                ))}
             </div>
          </section>

          <footer className="glass-card p-8 bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                   <ShieldCheck className="text-blue-400" />
                </div>
                <div>
                   <p className="font-bold">System Status</p>
                   <p className="text-xs text-white/50">All systems operational</p>
                </div>
             </div>
             <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-colors">
                Contact Support
             </button>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default HelpSupport;
