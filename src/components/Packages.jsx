import { Download, FileText } from 'lucide-react';

export default function Packages() {
  return (
    <section id="packages" className="py-20 bg-white dark:bg-brand-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Section header ─────────────────────────────── */}
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-brand-orange mb-3 block">
            Pricing & Services
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-neutral-900 dark:text-white mb-4">
            Packages
          </h2>
          <p className="text-neutral-500 dark:text-brand-dark-subtle max-w-xl mx-auto">
            Download our full packages guide to explore session types, inclusions, and pricing tailored for every occasion.
          </p>
        </div>

        {/* ── Download card ──────────────────────────────── */}
        <div className="max-w-md mx-auto">
          <div
            className="flex flex-col items-center gap-6 p-10
                       rounded-2xl border border-neutral-100 dark:border-brand-dark-line
                       bg-neutral-50 dark:bg-brand-dark-surface
                       shadow-sm"
          >
            {/* Icon */}
            <div
              className="w-16 h-16 rounded-2xl bg-brand-orange/10
                         flex items-center justify-center"
            >
              <FileText size={30} className="text-brand-orange" />
            </div>

            <div className="text-center">
              <p className="font-bold text-lg text-neutral-900 dark:text-white mb-1">
                Lumiera Packages Guide
              </p>
              <p className="text-sm text-neutral-500 dark:text-brand-dark-subtle">
                PDF · All sessions &amp; pricing included
              </p>
            </div>

            {/* Download button */}
            <a
              href="/packages.pdf"
              download="Lumiera-Packages.pdf"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl
                         bg-brand-orange hover:bg-brand-orange-dark active:scale-95
                         text-white font-semibold text-sm
                         shadow-md shadow-brand-orange/25 hover:shadow-brand-orange/40
                         transition-all duration-150"
            >
              <Download size={16} />
              Download Packages PDF
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
