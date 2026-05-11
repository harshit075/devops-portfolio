import React, { useState, useEffect } from 'react';
import { fetchJson, postJson, del } from './api';

type Todo = { id: number; text: string; done: boolean; priority: string; created_at: string };
type Filter = 'all' | 'active' | 'done';

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('normal');
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJson('/admin/todos').then(d => { setTodos(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const t = await postJson('/admin/todos', { text: input, priority });
    setTodos([t, ...todos]);
    setInput(''); setPriority('normal');
  };

  const toggle = async (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
    await fetch(`${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api')}/admin/todos/${id}`, { method: 'PUT' });
  };

  const remove = async (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
    await del(`/admin/todos/${id}`);
  };

  const clearDone = () => {
    todos.filter(t => t.done).forEach(t => del(`/admin/todos/${t.id}`));
    setTodos(todos.filter(t => !t.done));
  };

  const filtered = todos.filter(t => filter === 'all' ? true : filter === 'active' ? !t.done : t.done);
  const prioColor: Record<string, string> = { high: 'border-l-red-500', normal: 'border-l-cyan', low: 'border-l-gray-500' };
  const prioDot: Record<string, string> = { high: 'bg-red-500', normal: 'bg-cyan', low: 'bg-gray-500' };

  return (
    <div className="max-w-2xl mx-auto pt-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black uppercase tracking-widest text-cyan">Daily Tasks</h2>
        <span className="text-xs text-text-muted">{todos.filter(t => t.done).length}/{todos.length} done</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-black/50 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan to-blue-500 transition-all duration-500 rounded-full"
          style={{ width: `${todos.length ? (todos.filter(t => t.done).length / todos.length) * 100 : 0}%` }} />
      </div>

      <form onSubmit={add} className="flex flex-col md:flex-row gap-2 mb-6">
        <input value={input} onChange={e => setInput(e.target.value)}
          className="flex-1 bg-black/40 border border-border-color p-3 focus:outline-none focus:border-cyan text-sm rounded"
          placeholder="What needs to be done?" />
        <select value={priority} onChange={e => setPriority(e.target.value)}
          className="bg-black/40 border border-border-color p-3 text-xs uppercase tracking-widest rounded focus:outline-none focus:border-cyan cursor-pointer">
          <option value="high">🔴 High</option>
          <option value="normal">🔵 Normal</option>
          <option value="low">⚪ Low</option>
        </select>
        <button type="submit" className="bg-cyan text-black px-6 py-3 font-bold uppercase tracking-widest hover:bg-cyan/80 transition-colors rounded text-sm">Add</button>
      </form>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {(['all', 'active', 'done'] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs uppercase tracking-widest rounded transition-colors ${filter === f ? 'bg-cyan/20 text-cyan border border-cyan/30' : 'text-text-muted hover:bg-white/5 border border-transparent'}`}>
              {f}
            </button>
          ))}
        </div>
        {todos.some(t => t.done) && (
          <button onClick={clearDone} className="text-xs text-red-400 hover:text-red-300 uppercase tracking-widest">Clear done</button>
        )}
      </div>

      <div className="space-y-2">
        {loading && <p className="text-text-muted text-sm text-center py-8 animate-pulse">Loading tasks...</p>}
        {!loading && filtered.map(t => (
          <div key={t.id} className={`flex items-center justify-between p-3 border border-border-color border-l-4 ${prioColor[t.priority] || prioColor.normal} bg-black/30 hover:bg-black/40 transition-all rounded group`}>
            <div className="flex items-center space-x-3 cursor-pointer flex-1" onClick={() => toggle(t.id)}>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${t.done ? 'bg-cyan border-cyan text-black scale-110' : 'border-border-color hover:border-cyan'}`}>
                {t.done && <span className="text-xs font-bold">✓</span>}
              </div>
              <div className="flex flex-col">
                <span className={`text-sm transition-all ${t.done ? 'line-through text-text-muted opacity-60' : ''}`}>{t.text}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${prioDot[t.priority] || prioDot.normal}`} />
                  <span className="text-[10px] text-text-muted uppercase">{t.priority}</span>
                </div>
              </div>
            </div>
            <button onClick={() => remove(t.id)} className="text-red-500/50 hover:text-red-400 text-xs uppercase opacity-0 group-hover:opacity-100 transition-opacity ml-4">✕</button>
          </div>
        ))}
        {!loading && filtered.length === 0 && <p className="text-text-muted text-sm text-center py-8 italic opacity-60">No tasks here.</p>}
      </div>
    </div>
  );
}
