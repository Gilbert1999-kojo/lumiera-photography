import { Mail, Globe, Share2, Link } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  const socials = [
    { icon: <Globe size={18} />,  href: '#', label: 'Website' },
    { icon: <Share2 size={18} />, href: '#', label: 'Twitter / X' },
    { icon: <Link size={18} />,   href: '#', label: 'LinkedIn' },
    { icon: <Mail size={18} />,   href: 'mailto:hello@portfolio.com', label: 'Email' },
  ];

  return (
    <footer id="contact" className="bg-brand-dark dark:bg-brand-dark text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-14">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <span className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center text-white text-sm font-black">
                L
              </span>
              <span>Lumiera<span className="text-brand-orange">.</span></span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
              Lumiera Studios is a photography practice specialising in weddings,
              portraits, events, and commercial work. Based globally, booking worldwide.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                ['Home',           '#'        ],
                ['Portfolio',      '#portfolio'],
                ['Book a Session', '#booking' ],
                ['Contact',        'mailto:hello@lumierastudios.com'],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-neutral-400 hover:text-brand-orange-light transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4">
              Get in Touch
            </h4>
            <a
              href="mailto:hello@lumierastudios.com"
              className="text-sm text-brand-orange hover:text-brand-orange-light transition-colors block mb-2"
            >
              hello@lumierastudios.com
            </a>
            <p className="text-sm text-neutral-400">Available Mon – Fri, 9 AM – 6 PM</p>

            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {socials.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-brand-dark-muted hover:bg-brand-orange
                             flex items-center justify-center text-neutral-400 hover:text-white
                             transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row
                        justify-between items-center gap-3 text-xs text-neutral-600">
          <span>© {year} Lumiera Studios. All rights reserved.</span>
          <span>
            Photography by{' '}
            <span className="text-brand-orange">Lumiera Studios</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
