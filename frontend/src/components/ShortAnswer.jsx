import React from 'react';

const ShortAnswer = ({ question, savedAnswer, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-900 leading-relaxed">
          {question.question_text}
        </h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Type your answer below</p>
      </div>

      <div className="space-y-2">
        <textarea
          className="w-full min-h-[150px] p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 font-medium"
          placeholder="Enter your response here..."
          value={savedAnswer || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex justify-between items-center px-1">
          <p className="text-[10px] text-slate-400 font-medium uppercase">Character count: {(savedAnswer || '').length}</p>
          <p className="text-[10px] text-slate-400 font-medium uppercase italic">Auto-saving enabled</p>
        </div>
      </div>
    </div>
  );
};

export default ShortAnswer;
