import { useState, useEffect, useRef } from 'react';

const PRESETS = [
  { label: 'Focus', time: 25 * 60, color: 'from-cyan to-blue-500' },
  { label: 'Short Break', time: 5 * 60, color: 'from-green-400 to-emerald-500' },
  { label: 'Long Break', time: 15 * 60, color: 'from-purple-400 to-pink-500' },
];

export function TimerApp() {
  const [preset, setPreset] = useState(0);
  const [time, setTime] = useState(PRESETS[0].time);
  const [total, setTotal] = useState(PRESETS[0].time);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any = null;
    if (isActive && time > 0) {
      interval = setInterval(() => setTime(t => t - 1), 1000);
    } else if (time === 0 && isActive) {
      setIsActive(false);
      setSessions(s => s + 1);
      try { new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH+Jj4yGfXB0eoSNk5GKgHRwdX+Li5KQiIB0cHV/i4uSkIiAdHB1f4uLkpA=').play(); } catch {}
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const selectPreset = (i: number) => {
    setPreset(i); setTime(PRESETS[i].time); setTotal(PRESETS[i].time); setIsActive(false);
  };

  const toggleFs = () => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen().catch(() => {});
    else document.exitFullscreen();
  };

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const progress = total > 0 ? ((total - time) / total) * 100 : 0;
  const circumference = 2 * Math.PI * 120;

  return (
    <div ref={containerRef} className={`flex flex-col items-center justify-center transition-all ${isFullscreen ? 'bg-black h-screen w-screen fixed inset-0 z-[100] p-8' : 'h-full pt-4'}`}>
      {!isFullscreen && <h2 className="text-2xl font-black uppercase tracking-widest text-cyan mb-4">Focus Timer</h2>}

      {/* Preset pills */}
      <div className="flex gap-2 mb-8">
        {PRESETS.map((p, i) => (
          <button key={i} onClick={() => selectPreset(i)}
            className={`px-4 py-2 text-xs uppercase tracking-widest rounded-full border transition-all ${preset === i ? 'border-cyan bg-cyan/10 text-cyan' : 'border-border-color text-text-muted hover:border-white/30'}`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Circular progress */}
      <div className="relative mb-8">
        <svg width="280" height="280" className="-rotate-90">
          <circle cx="140" cy="140" r="120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="140" cy="140" r="120" fill="none"
            stroke="url(#timerGrad)" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={circumference - (progress / 100) * circumference}
            className="transition-all duration-1000" />
          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00e5ff" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-mono font-black tracking-widest text-cyan drop-shadow-[0_0_30px_rgba(0,255,255,0.4)] ${isFullscreen ? 'text-7xl' : 'text-6xl'}`}>
            {fmt(time)}
          </div>
          <div className="text-xs text-text-muted uppercase tracking-widest mt-2">{PRESETS[preset].label}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button onClick={() => setIsActive(!isActive)}
          className={`px-8 py-3 rounded font-bold uppercase tracking-widest transition-all text-sm ${isActive ? 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30' : 'bg-cyan text-black hover:bg-cyan/80'}`}>
          {isActive ? 'Pause' : time < total ? 'Resume' : 'Start'}
        </button>
        <button onClick={() => { setIsActive(false); setTime(PRESETS[preset].time); setTotal(PRESETS[preset].time); }}
          className="px-6 py-3 border border-border-color rounded hover:border-white/40 transition-colors uppercase tracking-widest text-xs text-text-muted">
          Reset
        </button>
      </div>

      {/* Footer info */}
      <div className="flex items-center gap-6 mt-8 text-text-muted">
        <button onClick={toggleFs} className="hover:text-cyan flex items-center gap-2 uppercase text-xs tracking-widest transition-colors">
          ⛶ <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
        </button>
        <span className="text-xs uppercase tracking-widest">Sessions: <span className="text-cyan font-bold">{sessions}</span></span>
      </div>
    </div>
  );
}
