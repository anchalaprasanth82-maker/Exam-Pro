import React from 'react';
import { Flag } from 'lucide-react';

const QuestionPalette = ({ questions, answers, currentIdx, onSelect, flaggedQuestions, onToggleFlag }) => {
  if (!questions || questions.length === 0) return null;
  return (
    <div className="glass-card p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Question Navigator</h3>
        <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
            {currentIdx + 1} / {questions.length}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {questions.map((q, idx) => {
          const isAnswered = !!answers[q.id];
          const isCurrent = currentIdx === idx;
          const isFlagged = flaggedQuestions.includes(q.id);

          let bgColor = 'bg-white border-slate-200 text-slate-500';
          if (isAnswered) bgColor = 'bg-green-50 border-green-200 text-green-600';
          if (isFlagged) bgColor = 'bg-orange-50 border-orange-200 text-orange-600';
          if (isCurrent) bgColor = 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100';

          return (
            <button
              key={q?.id || idx}
              onClick={() => onSelect(idx)}
              className={`
                relative h-10 w-10 rounded-lg border text-sm font-bold transition-all flex items-center justify-center
                ${bgColor}
                ${!isCurrent && 'hover:border-slate-400'}
              `}
            >
              {idx + 1}
              {isFlagged && !isCurrent && (
                <div className="absolute -top-1 -right-1">
                    <Flag className="w-3 h-3 fill-orange-500 text-orange-500" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Legend</p>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-3 h-3 rounded bg-white border border-slate-200"></span> Not Visited
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <span className="w-3 h-3 rounded bg-green-500"></span> Answered
          </div>
          <div className="flex items-center gap-2 text-orange-600">
            <span className="w-3 h-3 rounded bg-orange-500"></span> Flagged
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <span className="w-3 h-3 rounded bg-blue-600"></span> Current
          </div>
        </div>
      </div>

      <button
        onClick={() => onToggleFlag(questions[currentIdx].id)}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
          flaggedQuestions.includes(questions[currentIdx].id)
            ? 'bg-orange-50 border-orange-300 text-orange-600'
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
      >
        <Flag className={`w-4 h-4 ${flaggedQuestions.includes(questions[currentIdx]?.id) ? 'fill-orange-600' : ''}`} />
        {flaggedQuestions.includes(questions[currentIdx]?.id) ? 'Unflag Question' : 'Flag for Review'}
      </button>
    </div>
  );
};

export default QuestionPalette;
