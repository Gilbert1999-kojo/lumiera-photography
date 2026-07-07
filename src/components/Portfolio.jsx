import { useState } from 'react';
import { portfolioItems, categories } from '../data/portfolioData';
import PortfolioModal from './PortfolioModal';
import { ArrowUpRight } from 'lucide-react';

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered =
    activeCategory === 'All'
      ? portfolioItems
      : portfolioItems.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 bg-neutral-50 dark:bg-brand-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Section header ─────────────────────────────── */}
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-brand-orange mb-3 block">
            Selected Work
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-neutral-900 dark:text-white mb-4">
            Portfolio
          </h2>
          <p className="text-neutral-500 dark:text-brand-dark-subtle max-w-xl mx-auto">
            Branding, digital, and creative projects crafted to leave a lasting impression.
          </p>
        </div>

        {/* ── Category filter ─────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150
                ${
                  activeCategory === cat
                    ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/25'
                    : 'bg-white dark:bg-brand-dark-surface text-neutral-500 dark:text-brand-dark-subtle border border-neutral-200 dark:border-brand-dark-line hover:border-brand-orange hover:text-brand-orange dark:hover:border-brand-orange dark:hover:text-brand-orange'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Project grid ────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <article
              key={item.id}
              onClick={() => setSelected(item)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl
                         bg-white dark:bg-brand-dark-surface
                         border border-neutral-100 dark:border-brand-dark-line
                         hover:border-brand-orange dark:hover:border-brand-orange
                         hover:shadow-xl hover:shadow-brand-orange/10
                         dark:hover:shadow-brand-orange/5
                         transition-all duration-300"
            >
              {/* Orange accent top bar — animates in on hover */}
              <div
                className="absolute top-0 inset-x-0 h-[3px] bg-brand-orange
                            scale-x-0 group-hover:scale-x-100 origin-left
                            transition-transform duration-300"
              />

              {/* Image */}
              <div className="relative overflow-hidden h-52">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Scrim on hover */}
                <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/25 transition-colors duration-300" />

                {/* Featured badge */}
                {item.featured && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full
                                   bg-brand-orange text-white text-xs font-bold
                                   shadow shadow-brand-orange/30">
                    Featured
                  </span>
                )}

                {/* Arrow link indicator */}
                <div
                  className="absolute top-3 right-3 w-8 h-8 rounded-full
                              bg-white dark:bg-brand-dark-elevated shadow-md
                              flex items-center justify-center
                              opacity-0 translate-y-1
                              group-hover:opacity-100 group-hover:translate-y-0
                              transition-all duration-200"
                >
                  <ArrowUpRight size={14} className="text-brand-orange" />
                </div>
              </div>

              {/* Card body */}
              <div className="p-5">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-orange">
                  {item.category}
                </span>
                <h3 className="mt-1 font-bold text-[15px] text-neutral-900 dark:text-white
                               leading-snug group-hover:text-brand-orange transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-500 dark:text-brand-dark-subtle line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium
                                 bg-neutral-100 dark:bg-brand-dark-line
                                 text-neutral-500 dark:text-brand-dark-subtle"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <PortfolioModal item={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
