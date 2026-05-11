import { useState, useEffect } from 'react';
import { fetchJson, postJson, del } from './api';

type Entry = { id: number; date: string; content: string };

export function DiaryApp() {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchJson('/admin/diary').then(d => { setEntries(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!entry.trim()) return;
    const e = await postJson('/admin/diary', { date: new Date().toLocaleString(), content: entry });
    setEntries([e, ...entries]);
    setEntry('');
  };

  const remove = async (id: number) => {
    setEntries(entries.filter(e => e.id !== id));
    await del(`/admin/diary/${id}`);
  };

  const filtered = search ? entries.filter(e => e.content.toLowerCase().includes(search.toLowerCase())) : entries;

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col pt-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black uppercase tracking-widest text-cyan">Diary</h2>
        <span className="text-xs text-text-muted">{entries.length} entries</span>
      </div>

      <div className="bg-black/30 border border-border-color rounded p-4 mb-6">
        <textarea value={entry} onChange={e => setEntry(e.target.value)} placeholder="What's on your mind today..."
          className="w-full h-28 bg-transparent focus:outline-none text-sm resize-none placeholder:text-text-muted/50" />
        <div className="flex justify-between items-center border-t border-border-color pt-3 mt-2">
          <span className="text-xs text-text-muted">{entry.trim().split(/\s+/).filter(Boolean).length} words</span>
          <button onClick={save} disabled={!entry.trim()}
            className="bg-cyan text-black px-6 py-1.5 font-bold uppercase tracking-widest hover:bg-cyan/80 transition-colors rounded text-xs disabled:opacity-30 disabled:cursor-not-allowed">
            Save
          </button>
        </div>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search entries..."
        className="bg-black/30 border border-border-color rounded p-2.5 text-xs mb-4 focus:outline-none focus:border-cyan placeholder:text-text-muted/40" />

      <div className="flex-1 overflow-y-auto space-y-3">
        {loading && <p className="text-text-muted text-sm text-center py-8 animate-pulse">Loading diary...</p>}
        {!loading && filtered.map(e => (
          <div key={e.id} className="bg-black/20 border border-border-color rounded p-4 group hover:border-cyan/30 transition-colors relative">
            <button onClick={() => remove(e.id)}
              className="absolute top-3 right-3 text-red-500/40 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            <div className="text-[10px] text-cyan/70 uppercase tracking-widest mb-2 font-medium">{e.date}</div>
            <p className="text-sm text-text-muted whitespace-pre-wrap leading-relaxed">{e.content}</p>
          </div>
        ))}
        {!loading && filtered.length === 0 && <p className="text-text-muted text-sm text-center py-8 italic opacity-60">{search ? 'No matching entries.' : 'Start writing your first entry.'}</p>}
      </div>
    </div>
  );
}
