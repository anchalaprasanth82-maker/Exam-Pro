import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Code2, Loader2, Terminal } from 'lucide-react';

const CodeEditor = ({ value, onChange, language = 'javascript' }) => {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    // Simulate execution
    setTimeout(() => {
      if (language === 'javascript') {
        try {
          // Dangerous in prod, but okay for a simulation demo
          // We'll just capture console.log or basic eval
          const logs = [];
          const customConsole = {
            log: (...args) => logs.push(args.join(' ')),
          };
          
          // Basic function to wrapper the user code
          const func = new Function('console', value);
          func(customConsole);
          
          setOutput(logs.join('\n') || 'Program executed with no output.');
        } catch (err) {
          setOutput(`Error: ${err.message}`);
        }
      } else {
        setOutput(`Simulated output for ${language}:\nProgram finished in 35ms.`);
      }
      setIsRunning(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs">
          <Code2 className="w-4 h-4" />
          Editor: {language.toUpperCase()}
        </div>
        <button 
          onClick={runCode}
          disabled={isRunning}
          className="flex items-center gap-2 px-3 py-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
        >
          {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-white" />}
          Run Code
        </button>
      </div>

      <div className="flex-1 min-h-[300px]">
        <Editor
          height="100%"
          defaultLanguage={language}
          value={value}
          onChange={onChange}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 22,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      <div className="bg-slate-900 h-32 p-4 flex flex-col font-mono text-xs overflow-auto">
        <div className="flex items-center gap-2 text-slate-500 border-b border-slate-800 pb-2 mb-2 uppercase tracking-widest font-bold">
          <Terminal className="w-3 h-3" />
          Console Output
        </div>
        <pre className="text-blue-400 whitespace-pre-wrap flex-1">{output || '> Ready...'}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
