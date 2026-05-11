import { useState, useEffect } from 'react';
import { fetchJson, postJson } from './api';

export function NotesApp() {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    fetchJson('/admin/notes').then(d => { setNote(d.note || ''); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    setStatus('saving');
    const t = setTimeout(() => {
      postJson('/admin/notes', { content: note }).then(() => setStatus('saved'));
    }, 800);
    return () => clearTimeout(t);
  }, [note, loading]);

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col pt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black uppercase tracking-widest text-cyan">Important Notes</h2>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status === 'saving' ? 'bg-yellow-400 animate-pulse' : status === 'saved' ? 'bg-green-400' : 'bg-gray-500'}`} />
          <span className="text-xs text-text-muted uppercase tracking-widest">
            {loading ? 'Loading...' : status === 'saving' ? 'Saving...' : 'Saved'}
          </span>
        </div>
      </div>
      <div className="text-xs text-text-muted mb-3">{note.length} characters</div>
      <textarea value={note} onChange={e => setNote(e.target.value)} disabled={loading}
        placeholder="Paste important snippets, passwords, links, or ideas here..."
        className="flex-1 w-full bg-black/30 border border-border-color rounded p-6 focus:outline-none focus:border-cyan text-sm leading-relaxed font-mono resize-none disabled:opacity-40" />
    </div>
  );
}
