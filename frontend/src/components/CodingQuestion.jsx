import React, { useState } from 'react';
import CodeEditor from './CodeEditor';

const CodingQuestion = ({ question, savedAnswer, onChange }) => {
  const [lang, setLang] = useState('javascript');

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900 leading-relaxed">
          {question.question_text}
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Programming Task</span>
          <select 
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 outline-none"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>
      </div>

      <div className="flex-1 min-h-[450px]">
        <CodeEditor 
          value={savedAnswer || ''} 
          onChange={onChange} 
          language={lang}
        />
      </div>
    </div>
  );
};

export default CodingQuestion;
