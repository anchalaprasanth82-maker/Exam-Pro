import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const Timer = ({ timeRemaining, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(timeRemaining);

  useEffect(() => {
    setTimeLeft(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft === 0, onTimeUp]);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = !isNaN(timeLeft) && timeLeft < 300; // Less than 5 mins

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
      isLowTime ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-50 border-slate-200 text-slate-700'
    }`}>
      <Clock className={`w-5 h-5 ${isLowTime ? 'animate-pulse' : ''}`} />
      <span className="font-mono text-lg font-bold tabular-nums">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default Timer;
