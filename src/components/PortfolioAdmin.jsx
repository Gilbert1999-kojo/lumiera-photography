import { useState } from 'react';
import { X, Plus, Upload, Lock, CheckCircle2, Trash2 } from 'lucide-react';

const ADMIN_PASSWORD = 'lumiera2026'; // Change this to your own password
const STORAGE_KEY    = 'lumiera_portfolio_uploads';
const CATEGORIES     = ['Wedding', 'Event', 'Brand', 'Portrait'];

/* ── Helpers ─────────────────────────────────────────────── */
export function loadUploadedItems() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch { return []; }
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/* ── Main component ─────────────────────────────────────── */
export default function PortfolioAdmin({ onItemsChange }) {
  const [phase,    setPhase]    = useState('closed');   // closed | auth | form | list
  const [password, setPassword] = useState('');
  const [authErr,  setAuthErr]  = useState('');
  const [form,     setForm]     = useState({ title: '', category: 'Wedding', image: '', description: '', year: new Date().getFullYear().toString() });
  const [preview,  setPreview]  = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [items,    setItems]    = useState(loadUploadedItems);

  /* Auth */
  const handleAuth = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { setPhase('form'); setAuthErr(''); }
    else setAuthErr('Incorrect password');
  };

  /* Image file → base64 */
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { alert('Image must be under 4 MB'); return; }
    const reader = new FileReader();
    reader.onload = () => { setPreview(reader.result); setForm((f) => ({ ...f, image: reader.result })); };
    reader.readAsDataURL(file);
  };

  /* Save portfolio item */
  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title || !form.image) return;
    setSaving(true);
    const newItem = { id: `upload_${Date.now()}`, ...form, featured: false };
    const updated = [newItem, ...items];
    setItems(updated);
    saveItems(updated);
    onItemsChange?.(updated);
    setSaving(false); setSaved(true);
    setTimeout(() => { setSaved(false); setForm({ title: '', category: 'Wedding', image: '', description: '', year: new Date().getFullYear().toString() }); setPreview(null); }, 1500);
  };

  /* Delete item */
  const handleDelete = (id) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    saveItems(updated);
    onItemsChange?.(updated);
  };

  const close = () => { setPhase('closed'); setPassword(''); setAuthErr(''); };

  const field = (key) => ({ value: form[key], onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })) });

  /* ── Floating button ─────────────────────────────────────── */
  return (
    <>
      <button
        onClick={() => setPhase(phase === 'closed' ? 'auth' : 'closed')}
        aria-label="Admin upload"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full
                   bg-brand-orange hover:bg-brand-orange-dark active:scale-95
                   text-white shadow-xl shadow-brand-orange/30
                   flex items-center justify-center
                   transition-all duration-200"
      >
        {phase === 'closed' ? <Plus size={22} /> : <X size={20} />}
      </button>

      {phase !== 'closed' && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="bg-white dark:bg-brand-dark-surface rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-brand-dark-line">
              <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Upload size={18} className="text-brand-orange" />
                {phase === 'auth' ? 'Admin Access' : phase === 'list' ? 'Uploaded Work' : 'Upload Portfolio Work'}
              </h3>
              <div className="flex items-center gap-2">
                {phase === 'form' && items.length > 0 && (
                  <button onClick={() => setPhase('list')} className="text-xs text-brand-orange font-medium hover:underline">
                    View uploads ({items.length})
                  </button>
                )}
                <button onClick={close} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-brand-dark-line transition-colors">
                  <X size={18} className="text-neutral-500" />
                </button>
              </div>
            </div>

            {/* ── Auth phase ─────────────────────────────── */}
            {phase === 'auth' && (
              <form onSubmit={handleAuth} className="p-6 space-y-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-brand-orange/10 mx-auto mb-2">
                  <Lock size={24} className="text-brand-orange" />
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                  Enter the admin password to manage your portfolio.
                </p>
                <input
                  type="password"
                  placeholder="Admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-brand-dark-line
                             bg-white dark:bg-brand-dark-elevated text-sm text-neutral-900 dark:text-white
                             placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
                {authErr && <p className="text-xs text-red-500">{authErr}</p>}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold text-sm transition-colors"
                >
                  Unlock
                </button>
              </form>
            )}

            {/* ── Upload form phase ──────────────────────── */}
            {phase === 'form' && (
              <form onSubmit={handleSave} className="p-6 space-y-4">
                {/* Image upload */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Image <span className="text-brand-orange">*</span>
                  </label>
                  <label
                    className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed
                               border-neutral-200 dark:border-brand-dark-line cursor-pointer
                               hover:border-brand-orange hover:bg-brand-orange/5 transition-colors overflow-hidden"
                  >
                    {preview || form.image.startsWith('http') ? (
                      <img src={preview || form.image} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-neutral-400">
                        <Upload size={24} />
                        <span className="text-xs">Click to upload (max 4 MB)</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                  </label>
                  <p className="text-xs text-neutral-400 mt-1">Or paste a URL below</p>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={form.image.startsWith('data:') ? '' : form.image}
                    onChange={(e) => { setForm((f) => ({ ...f, image: e.target.value })); setPreview(null); }}
                    className="w-full mt-2 px-3 py-2 rounded-lg border border-neutral-200 dark:border-brand-dark-line
                               bg-white dark:bg-brand-dark-elevated text-sm text-neutral-900 dark:text-white
                               placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Title <span className="text-brand-orange">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Wedding — Cape Town"
                    {...field('title')}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-brand-dark-line
                               bg-white dark:bg-brand-dark-elevated text-sm text-neutral-900 dark:text-white
                               placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>

                {/* Category + Year */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Category</label>
                    <select
                      {...field('category')}
                      className="w-full px-3 py-3 rounded-xl border border-neutral-200 dark:border-brand-dark-line
                                 bg-white dark:bg-brand-dark-elevated text-sm text-neutral-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    >
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Year</label>
                    <input
                      type="number"
                      min="2000" max="2100"
                      {...field('year')}
                      className="w-full px-3 py-3 rounded-xl border border-neutral-200 dark:border-brand-dark-line
                                 bg-white dark:bg-brand-dark-elevated text-sm text-neutral-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the shoot..."
                    {...field('description')}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-brand-dark-line
                               bg-white dark:bg-brand-dark-elevated text-sm text-neutral-900 dark:text-white
                               placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving || saved}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
                    ${saved
                      ? 'bg-green-500 text-white'
                      : 'bg-brand-orange hover:bg-brand-orange-dark text-white'
                    }`}
                >
                  {saved ? (
                    <span className="flex items-center justify-center gap-2"><CheckCircle2 size={16} /> Saved!</span>
                  ) : saving ? 'Saving…' : 'Add to Portfolio'}
                </button>
              </form>
            )}

            {/* ── Uploaded list phase ─────────────────────── */}
            {phase === 'list' && (
              <div className="p-6 space-y-3">
                <button onClick={() => setPhase('form')} className="text-sm text-brand-orange font-medium hover:underline mb-2 block">
                  + Add new item
                </button>
                {items.length === 0 && (
                  <p className="text-sm text-neutral-400 text-center py-6">No uploads yet.</p>
                )}
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 dark:border-brand-dark-line">
                    <img src={item.image} alt={item.title} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{item.title}</p>
                      <p className="text-xs text-neutral-400">{item.category} · {item.year}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
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
