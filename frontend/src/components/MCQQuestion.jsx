import React from 'react';

const MCQQuestion = ({ question, savedAnswer, onChange }) => {
  const options = JSON.parse(question.options || '[]');

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-900 leading-relaxed">
          {question.question_text}
        </h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select one option</p>
      </div>

      <div className="space-y-3">
        {options.map((option, idx) => (
          <label 
            key={idx}
            className={`
              flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all
              ${savedAnswer === option 
                ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400' 
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }
            `}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
              checked={savedAnswer === option}
              onChange={() => onChange(option)}
            />
            <span className={`text-base font-medium ${savedAnswer === option ? 'text-blue-900' : 'text-slate-700'}`}>
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MCQQuestion;
