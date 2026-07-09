import { useState, useEffect, useRef } from 'react';
import { X, Plus, Upload, Lock, CheckCircle2, Trash2, Loader2, ImageOff } from 'lucide-react';

const ADMIN_PASSWORD = 'lumiera2026'; // Change to your own password
const CATEGORIES     = ['Wedding', 'Event', 'Brand', 'Portrait'];

/* -- R2 helpers ------------------------------------------ */
async function r2Presign(filename, contentType) {
  const res = await fetch('/api/r2-presign', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, contentType }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function r2SaveItem(item) {
  const res = await fetch('/api/r2-items', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function r2ListItems() {
  const res = await fetch('/api/r2-items');
  if (!res.ok) return [];
  return res.json();
}

async function r2DeleteItem(id, key) {
  const res = await fetch('/api/r2-delete', {
    method: 'DELETE', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, key }),
  });
  if (!res.ok) throw new Error(await res.text());
}

export function loadUploadedItems() { return []; }

/* -- Main component -------------------------------------- */
export default function PortfolioAdmin({ onItemsChange }) {
  const [phase,     setPhase]    = useState('closed');
  const [password,  setPassword] = useState('');
  const [authErr,   setAuthErr]  = useState('');
  const [form,      setForm]     = useState({ title: '', category: 'Wedding', image: '', description: '', year: new Date().getFullYear().toString() });
  const [file,      setFile]     = useState(null);
  const [preview,   setPreview]  = useState(null);
  const [progress,  setProgress] = useState(0);
  const [status,    setStatus]   = useState('idle');
  const [statusMsg, setStatusMsg]= useState('');
  const [items,     setItems]    = useState([]);

  useEffect(() => {
    r2ListItems().then((data) => { setItems(data); onItemsChange?.(data); }).catch(() => {});
  }, []);

  const handleAuth = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { setPhase('form'); setAuthErr(''); }
    else setAuthErr('Incorrect password');
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 100 * 1024 * 1024) { alert('Image must be under 100 MB'); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setForm((prev) => ({ ...prev, image: '' }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const imageSource = file ? 'file' : form.image.trim() ? 'url' : null;
    if (!form.title || !imageSource) return;
    setStatus('uploading'); setProgress(0); setStatusMsg('Uploading image...');
    let publicUrl = form.image.trim();
    let r2Key = '';
    try {
      if (imageSource === 'file') {
        const { uploadUrl, publicUrl: pUrl, key } = await r2Presign(file.name, file.type);
        r2Key = key; publicUrl = pUrl;
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = (ev) => { if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 80)); };
          xhr.onload  = () => xhr.status < 400 ? resolve() : reject(new Error(`R2 upload ${xhr.status}`));
          xhr.onerror = () => reject(new Error('Network error'));
          xhr.open('PUT', uploadUrl);
          xhr.setRequestHeader('Content-Type', file.type);
          xhr.send(file);
        });
      }
      setStatus('saving'); setProgress(90); setStatusMsg('Saving to portfolio...');
      const newItem = { id: `r2_${Date.now()}`, title: form.title, category: form.category, description: form.description, year: form.year, image: publicUrl, key: r2Key, featured: false, createdAt: new Date().toISOString() };
      await r2SaveItem(newItem);
      setProgress(100);
      const updated = [newItem, ...items];
      setItems(updated); onItemsChange?.(updated);
      setStatus('done'); setStatusMsg('Saved!');
      setTimeout(() => {
        setStatus('idle'); setProgress(0); setStatusMsg('');
        setForm({ title: '', category: 'Wedding', image: '', description: '', year: new Date().getFullYear().toString() });
        setFile(null); setPreview(null);
      }, 1800);
    } catch (err) {
      console.error('[PortfolioAdmin]', err);
      setStatus('error'); setStatusMsg(err.message);
    }
  };

  const handleDelete = async (id, key) => {
    if (!confirm('Delete this portfolio item?')) return;
    await r2DeleteItem(id, key).catch(() => {});
    const updated = items.filter((i) => i.id !== id);
    setItems(updated); onItemsChange?.(updated);
  };

  const close = () => { setPhase('closed'); setPassword(''); setAuthErr(''); };
  const field = (k) => ({ value: form[k], onChange: (e) => setForm((f) => ({ ...f, [k]: e.target.value })) });
  const busy  = status === 'uploading' || status === 'saving';

  return (
    <>
      <button onClick={() => setPhase(phase === 'closed' ? 'auth' : 'closed')} aria-label="Admin upload"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-brand-orange hover:bg-brand-orange-dark active:scale-95 text-white shadow-xl shadow-brand-orange/30 flex items-center justify-center transition-all duration-200">
        {phase === 'closed' ? <Plus size={22} /> : <X size={20} />}
      </button>

      {phase !== 'closed' && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="bg-white dark:bg-brand-dark-surface rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-brand-dark-line">
              <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Upload size={18} className="text-brand-orange" />
                {phase === 'auth' ? 'Admin Access' : phase === 'list' ? 'Manage Uploads' : 'Upload Portfolio Work'}
              </h3>
              <div className="flex items-center gap-3">
                {phase === 'form' && items.length > 0 && (
                  <button onClick={() => setPhase('list')} className="text-xs text-brand-orange font-medium hover:underline">Manage ({items.length})</button>
                )}
                <button onClick={close} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-brand-dark-line transition-colors">
                  <X size={18} className="text-neutral-500" />
                </button>
              </div>
            </div>

            {phase === 'auth' && (
              <form onSubmit={handleAuth} className="p-6 space-y-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-brand-orange/10 mx-auto mb-2">
                  <Lock size={24} className="text-brand-orange" />
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">Enter the admin password to manage your portfolio.</p>
                <input type="password" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-brand-dark-line bg-white dark:bg-brand-dark-elevated text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-orange" />
                {authErr && <p className="text-xs text-red-500">{authErr}</p>}
                <button type="submit" className="w-full py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold text-sm transition-colors">Unlock</button>
              </form>
            )}

            {phase === 'form' && (
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Image <span className="text-brand-orange">*</span></label>
                  <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-neutral-200 dark:border-brand-dark-line cursor-pointer hover:border-brand-orange hover:bg-brand-orange/5 transition-colors overflow-hidden">
                    {preview || (form.image && form.image.startsWith('http')) ? (
                      <img src={preview || form.image} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-neutral-400">
                        <Upload size={26} />
                        <span className="text-xs font-medium">Click to upload · Max 100 MB</span>
                        <span className="text-[11px] text-neutral-300">JPG, PNG, WEBP, HEIC</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={busy} />
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-px bg-neutral-100 dark:bg-brand-dark-line" />
                    <span className="text-[11px] text-neutral-400">or paste a URL</span>
                    <div className="flex-1 h-px bg-neutral-100 dark:bg-brand-dark-line" />
                  </div>
                  <input type="url" placeholder="https://..." disabled={busy || !!file}
                    value={file ? '' : form.image}
                    onChange={(e) => { setFile(null); setPreview(null); setForm((f) => ({ ...f, image: e.target.value })); }}
                    className="w-full mt-2 px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-brand-dark-line bg-white dark:bg-brand-dark-elevated text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-orange disabled:opacity-50" />
                </div>

                {busy && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span className="flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" />{statusMsg}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-brand-dark-line rounded-full overflow-hidden">
                      <div className="h-full bg-brand-orange rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2">{statusMsg}</p>
                )}

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Title <span className="text-brand-orange">*</span></label>
                  <input type="text" placeholder="e.g. Summer Wedding — Cape Town" {...field('title')} required disabled={busy}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-brand-dark-line bg-white dark:bg-brand-dark-elevated text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-orange disabled:opacity-50" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Category</label>
                    <select {...field('category')} disabled={busy}
                      className="w-full px-3 py-3 rounded-xl border border-neutral-200 dark:border-brand-dark-line bg-white dark:bg-brand-dark-elevated text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange disabled:opacity-50">
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Year</label>
                    <input type="number" min="2000" max="2100" {...field('year')} disabled={busy}
                      className="w-full px-3 py-3 rounded-xl border border-neutral-200 dark:border-brand-dark-line bg-white dark:bg-brand-dark-elevated text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange disabled:opacity-50" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Description</label>
                  <textarea rows={2} placeholder="Brief description of the shoot..." {...field('description')} disabled={busy}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-brand-dark-line bg-white dark:bg-brand-dark-elevated text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none disabled:opacity-50" />
                </div>

                <button type="submit" disabled={busy}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${status === 'done' ? 'bg-green-500 text-white' : 'bg-brand-orange hover:bg-brand-orange-dark text-white disabled:opacity-60 disabled:cursor-not-allowed'}`}>
                  {status === 'done' ? <><CheckCircle2 size={16} /> Saved to Portfolio!</> : busy ? <><Loader2 size={16} className="animate-spin" /> {statusMsg}</> : 'Upload & Add to Portfolio'}
                </button>
              </form>
            )}

            {phase === 'list' && (
              <div className="p-6 space-y-3">
                <button onClick={() => setPhase('form')} className="text-sm text-brand-orange font-medium hover:underline mb-2 block">+ Upload new image</button>
                {items.length === 0 && (
                  <div className="flex flex-col items-center gap-2 py-10 text-neutral-400">
                    <ImageOff size={32} /><p className="text-sm">No uploads yet.</p>
                  </div>
                )}
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 dark:border-brand-dark-line">
                    <img src={item.image} alt={item.title} className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-neutral-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{item.title}</p>
                      <p className="text-xs text-neutral-400">{item.category} · {item.year}</p>
                    </div>
                    <button onClick={() => handleDelete(item.id, item.key)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-red-500 transition-colors flex-shrink-0">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
