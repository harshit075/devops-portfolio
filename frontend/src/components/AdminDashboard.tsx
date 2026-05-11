import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchJson, Stats } from './admin/api';
import { TodoApp } from './admin/TodoApp';
import { TimerApp } from './admin/TimerApp';
import { DiaryApp } from './admin/DiaryApp';
import { GoalsApp } from './admin/GoalsApp';
import { NotesApp } from './admin/NotesApp';

type Tab = 'dashboard' | 'todo' | 'timer' | 'diary' | 'goals' | 'notes';

const NAV = [
  { id: 'dashboard' as Tab, icon: '📊', label: 'Overview' },
  { id: 'todo' as Tab, icon: '✅', label: 'Tasks' },
  { id: 'timer' as Tab, icon: '⏱️', label: 'Timer' },
  { id: 'diary' as Tab, icon: '📓', label: 'Diary' },
  { id: 'goals' as Tab, icon: '🎯', label: 'Goals' },
  { id: 'notes' as Tab, icon: '📌', label: 'Notes' },
];

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const greeting = clock.getHours() < 12 ? 'Good Morning' : clock.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="flex h-full w-full bg-[#0a0a0f] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-16 md:w-56 border-r border-white/[0.06] flex flex-col bg-[#0d0d14]">
        {/* Logo */}
        <div className="p-4 border-b border-white/[0.06]">
          <div className="hidden md:flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-blue-600 flex items-center justify-center text-sm font-black">H</div>
            <div>
              <div className="text-sm font-bold tracking-wide">Harshit</div>
              <div className="text-[10px] text-text-muted uppercase tracking-widest">Admin Panel</div>
            </div>
          </div>
          <div className="md:hidden flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-blue-600 flex items-center justify-center text-sm font-black">H</div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setActiveTab(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left group relative ${
                activeTab === n.id
                  ? 'bg-cyan/10 text-cyan'
                  : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'
              }`}>
              {activeTab === n.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan rounded-r" />}
              <span className="text-base">{n.icon}</span>
              <span className="hidden md:block text-xs font-semibold tracking-wide">{n.label}</span>
            </button>
          ))}
        </div>

        {/* Sidebar bottom */}
        <div className="p-2 border-t border-white/[0.06]">
          <div className="hidden md:block text-center text-[10px] text-text-muted mb-2 font-mono">
            {clock.toLocaleTimeString()}
          </div>
          <button onClick={onLogout}
            className="w-full py-2.5 rounded-lg border border-red-500/20 text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all text-xs font-semibold tracking-wide flex items-center justify-center gap-2">
            <span className="md:hidden">🚪</span>
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.04] px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold">{greeting}, Harshit</h1>
            <p className="text-[11px] text-text-muted">{clock.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-green-400/60 font-mono uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            DB Connected
          </div>
        </div>

        <div className="p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="h-full">
              {activeTab === 'dashboard' && <Overview onNavigate={setActiveTab} />}
              {activeTab === 'todo' && <TodoApp />}
              {activeTab === 'timer' && <TimerApp />}
              {activeTab === 'diary' && <DiaryApp />}
              {activeTab === 'goals' && <GoalsApp />}
              {activeTab === 'notes' && <NotesApp />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Overview({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const today = now.getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    fetchJson('/admin/stats').then(setStats).catch(() => {});
  }, []);

  const cards = [
    { label: 'Tasks', val: stats ? `${stats.todos.done}/${stats.todos.total}` : '—', sub: 'Completed', icon: '✅', tab: 'todo' as Tab, color: 'from-blue-500 to-cyan' },
    { label: 'Diary', val: stats ? `${stats.diary.total}` : '—', sub: 'Entries', icon: '📓', tab: 'diary' as Tab, color: 'from-green-500 to-emerald-400' },
    { label: 'Goals', val: stats ? `${stats.goals.avgProgress}%` : '—', sub: 'Avg Progress', icon: '🎯', tab: 'goals' as Tab, color: 'from-purple-500 to-pink-400' },
    { label: 'Focus', val: '25m', sub: 'Pomodoro', icon: '⏱️', tab: 'timer' as Tab, color: 'from-orange-500 to-yellow-400' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(c => (
          <button key={c.label} onClick={() => onNavigate(c.tab)}
            className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-left hover:border-cyan/30 hover:bg-white/[0.05] transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg">{c.icon}</span>
              <span className="text-[10px] text-text-muted uppercase tracking-widest group-hover:text-cyan transition-colors">→</span>
            </div>
            <div className="text-2xl font-black bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}>
              <span className={`bg-gradient-to-r ${c.color} bg-clip-text text-transparent`}>{c.val}</span>
            </div>
            <div className="text-[11px] text-text-muted mt-1">{c.sub}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity graph */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">Weekly Activity</div>
          <div className="flex items-end justify-between gap-2 h-40">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => {
              const h = [40, 70, 45, 90, 65, 80, 55][i];
              return (
                <div key={d} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-white/[0.04] rounded-t relative" style={{ height: '100%' }}>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.8, delay: i * 0.08 }}
                      className="absolute bottom-0 w-full bg-gradient-to-t from-cyan/80 to-cyan/30 rounded-t group-hover:from-cyan group-hover:to-cyan/50 transition-colors" />
                  </div>
                  <span className="text-[10px] text-text-muted">{d}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">
            {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
            {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} className="text-cyan/60 font-bold py-1">{d}</div>)}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => (
              <div key={i} className={`py-1 rounded transition-colors ${i + 1 === today ? 'bg-cyan text-black font-bold' : 'hover:bg-white/[0.06] text-white/60'}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'New Task', tab: 'todo' as Tab, icon: '➕', desc: 'Add to-do items' },
          { label: 'Start Timer', tab: 'timer' as Tab, icon: '▶️', desc: 'Focus session' },
          { label: 'Write Entry', tab: 'diary' as Tab, icon: '✍️', desc: 'Journal thoughts' },
          { label: 'Save Note', tab: 'notes' as Tab, icon: '📝', desc: 'Quick capture' },
        ].map(q => (
          <button key={q.label} onClick={() => onNavigate(q.tab)}
            className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-left hover:border-cyan/20 hover:bg-white/[0.04] transition-all group">
            <span className="text-lg">{q.icon}</span>
            <div className="text-xs font-semibold mt-2 group-hover:text-cyan transition-colors">{q.label}</div>
            <div className="text-[10px] text-text-muted mt-0.5">{q.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
