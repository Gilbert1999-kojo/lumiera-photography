import { X, ExternalLink, Tag } from 'lucide-react';
import { useEffect } from 'react';

export default function PortfolioModal({ item, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-brand-dark-surface rounded-2xl
                      shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 p-2 rounded-full
                     bg-black/30 hover:bg-black/50 text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Image */}
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-56 sm:h-72 object-cover"
        />

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest
                               text-brand-orange mb-1 block">
                {item.category} · {item.year}
              </span>
              <h2 className="text-2xl font-bold text-black dark:text-white leading-tight">
                {item.title}
              </h2>
            </div>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
            {item.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                           bg-brand-orange-pale dark:bg-brand-orange/15
                           text-brand-orange dark:text-brand-orange-light
                           border border-brand-orange/30 dark:border-brand-orange/30"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <a
              href="#booking"
              onClick={onClose}
              className="flex-1 text-center py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-dark
                         text-white font-semibold text-sm transition-colors"
            >
              Book a Similar Project
            </a>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-neutral-200 dark:border-brand-dark-line
                         text-neutral-600 dark:text-neutral-400
                         hover:border-brand-orange hover:text-brand-orange transition-colors"
            >
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
