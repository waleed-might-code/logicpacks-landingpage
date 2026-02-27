import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useBeta } from './BetaModal';

export default function Footer() {
  const { openBetaModal } = useBeta();
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
        {/* Brand */}
        <div className="p-8 md:col-span-1 flex flex-col justify-between min-h-[280px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="solar:widget-5-linear" className="text-green-500 text-lg" />
              <span className="text-white font-semibold text-sm tracking-tight">Logic Packs</span>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed mb-6">The operating system for reusable software.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={openBetaModal} className="w-8 h-8 rounded-md border border-white/[0.06] flex items-center justify-center hover:bg-white/5 transition-colors">
              <Icon icon="simple-icons:github" className="text-neutral-500 text-sm" />
            </button>
            <button onClick={openBetaModal} className="w-8 h-8 rounded-md border border-white/[0.06] flex items-center justify-center hover:bg-white/5 transition-colors">
              <Icon icon="simple-icons:discord" className="text-neutral-500 text-sm" />
            </button>
            <button onClick={openBetaModal} className="w-8 h-8 rounded-md border border-white/[0.06] flex items-center justify-center hover:bg-white/5 transition-colors">
              <Icon icon="simple-icons:x" className="text-neutral-500 text-sm" />
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="p-8 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">Platform</h4>
            <ul className="space-y-3">
              <li><Link to="/#modes" className="text-neutral-500 text-sm hover:text-white transition-colors">UI Mode</Link></li>
              <li><Link to="/#modes" className="text-neutral-500 text-sm hover:text-white transition-colors">Logic Mode</Link></li>
              <li><Link to="/#modes" className="text-neutral-500 text-sm hover:text-white transition-colors">Notebook</Link></li>
              <li><Link to="/#modes" className="text-neutral-500 text-sm hover:text-white transition-colors">Canvas</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">Ventures</h4>
            <ul className="space-y-3">
              <li><Link to="/ventures" className="text-neutral-500 text-sm hover:text-white transition-colors">Overview</Link></li>
              <li><Link to="/founders" className="text-neutral-500 text-sm hover:text-white transition-colors">For Founders</Link></li>
              <li><Link to="/investors" className="text-neutral-500 text-sm hover:text-white transition-colors">For Investors</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">Resources</h4>
            <ul className="space-y-3">
              <li><button onClick={openBetaModal} className="text-neutral-500 text-sm hover:text-white transition-colors">Documentation</button></li>
              <li><Link to="/cli" className="text-neutral-500 text-sm hover:text-white transition-colors">LPC CLI</Link></li>
              <li><Link to="/store" className="text-neutral-500 text-sm hover:text-white transition-colors">Pack Marketplace</Link></li>
              <li><Link to="/shop" className="text-neutral-500 text-sm hover:text-white transition-colors">Hardware Shop</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">Newsletter</h4>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="you@email.com" className="w-full bg-transparent border-b border-white/15 py-2 text-white text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-neutral-700" />
              <button className="self-start text-xs text-neutral-500 uppercase tracking-widest hover:text-white transition-colors">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="text-neutral-700 text-xs">&copy; 2026 Logic Packs. All rights reserved.</span>
          <div className="flex gap-4">
            <button onClick={openBetaModal} className="text-neutral-700 text-xs hover:text-white transition-colors">Privacy</button>
            <button onClick={openBetaModal} className="text-neutral-700 text-xs hover:text-white transition-colors">Terms</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

