import React, { useState, useEffect } from 'react';
import { fetchJson, postJson, putJson, del } from './api';

type Goal = { id: number; text: string; progress: number };

export function GoalsApp() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJson('/admin/goals').then(d => { setGoals(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const g = await postJson('/admin/goals', { text: input });
    setGoals([...goals, g]);
    setInput('');
  };

  const update = async (id: number, progress: number) => {
    setGoals(goals.map(x => x.id === id ? { ...x, progress } : x));
    await putJson(`/admin/goals/${id}`, { progress });
  };

  const remove = async (id: number) => {
    setGoals(goals.filter(g => g.id !== id));
    await del(`/admin/goals/${id}`);
  };

  const avg = goals.length ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0;
  const getColor = (p: number) => p >= 80 ? 'from-green-400 to-emerald-500' : p >= 50 ? 'from-cyan to-blue-500' : p >= 25 ? 'from-yellow-400 to-orange-500' : 'from-red-400 to-pink-500';

  return (
    <div className="max-w-2xl mx-auto pt-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black uppercase tracking-widest text-cyan">Year Goals</h2>
        <div className="text-right">
          <div className="text-3xl font-black text-cyan">{avg}%</div>
          <div className="text-[10px] text-text-muted uppercase tracking-widest">Average</div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="h-2 bg-black/50 rounded-full mb-8 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${getColor(avg)} transition-all duration-700 rounded-full`} style={{ width: `${avg}%` }} />
      </div>

      <form onSubmit={add} className="flex gap-2 mb-8">
        <input value={input} onChange={e => setInput(e.target.value)}
          className="flex-1 bg-black/40 border border-border-color p-3 rounded focus:outline-none focus:border-cyan text-sm"
          placeholder="Add a new goal..." />
        <button type="submit" className="bg-cyan text-black px-6 font-bold uppercase tracking-widest hover:bg-cyan/80 transition-colors rounded text-sm">Add</button>
      </form>

      <div className="space-y-4">
        {loading && <p className="text-text-muted text-sm text-center py-8 animate-pulse">Loading goals...</p>}
        {!loading && goals.map(g => (
          <div key={g.id} className="bg-black/20 border border-border-color rounded p-5 group hover:border-cyan/30 transition-colors relative">
            <button onClick={() => remove(g.id)}
              className="absolute top-4 right-4 text-xs text-red-500/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm">{g.text}</span>
              <span className={`text-sm font-black px-2 py-0.5 rounded ${g.progress >= 100 ? 'bg-green-500/20 text-green-400' : 'text-cyan'}`}>
                {g.progress}%
              </span>
            </div>
            <div className="relative h-2.5 bg-black/50 rounded-full overflow-hidden">
              <div className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getColor(g.progress)} rounded-full transition-all duration-300`}
                style={{ width: `${g.progress}%` }} />
            </div>
            <input type="range" min="0" max="100" value={g.progress}
              onChange={e => update(g.id, parseInt(e.target.value))}
              className="w-full mt-2 accent-cyan cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity h-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
