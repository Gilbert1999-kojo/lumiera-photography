import { ArrowDown, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-brand-dark py-24 sm:py-32">
      {/* Decorative background blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full
                      bg-brand-orange/20 dark:bg-brand-orange/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full
                      bg-brand-orange/10 dark:bg-brand-orange/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full
                        border border-brand-orange/30 dark:border-brand-orange/40
                        bg-brand-orange-pale dark:bg-brand-orange/10
                        text-brand-orange text-sm font-medium">
          <Sparkles size={14} />
          Booking open — 2026
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight
                       text-black dark:text-white leading-none mb-6">
          Moments made<br />
          <span className="text-brand-orange">to last forever.</span>
        </h1>

        {/* Sub-headline */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl
                      text-neutral-600 dark:text-neutral-400 leading-relaxed mb-10">
          Lumiera Studios captures portraits, weddings, events, and commercial
          work with a bold, cinematic eye. Based everywhere, booking worldwide.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#portfolio"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl
                       bg-brand-orange hover:bg-brand-orange-dark active:scale-95
                       text-white font-bold text-base transition-all shadow-lg shadow-brand-orange/25"
          >
            View Portfolio
          </a>
          <a
            href="#booking"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl
                       border-2 border-black dark:border-white
                       text-black dark:text-white font-bold text-base
                       hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black
                       transition-colors"
          >
            Book a Session
          </a>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex justify-center">
          <a
            href="#portfolio"
            aria-label="Scroll to portfolio"
            className="flex flex-col items-center gap-2 text-neutral-400 dark:text-neutral-600
                       hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
          >
            <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
            <ArrowDown size={16} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
