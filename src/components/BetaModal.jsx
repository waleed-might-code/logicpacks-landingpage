import { createContext, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

/* ──────────────────────────────────────────────────────────
   BETA MODAL — Global "Logic Packs is in beta" popup
   
   Usage:
     import { useBeta } from '../components/BetaModal';
     const { openBeta } = useBeta();
     <button onClick={openBeta}>Get Started</button>
   ────────────────────────────────────────────────────────── */

const COMMUNITY_LINK = 'https://chat.whatsapp.com/HxaG4RUxAEe4m77DgrUTYS?mode=gi_t';

const BetaContext = createContext({ openBeta: () => {}, openBetaModal: () => {} });

export function useBeta() {
  return useContext(BetaContext);
}

export function BetaProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openBeta = (e) => {
    if (e) e.preventDefault();
    setIsOpen(true);
  };

  const closeBeta = () => setIsOpen(false);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <BetaContext.Provider value={{ openBeta, openBetaModal: openBeta }}>
      {children}

      {/* ═══ MODAL OVERLAY ═══ */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeBeta}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-[#111] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 animate-in fade-in zoom-in-95">
            {/* Close button */}
            <button
              onClick={closeBeta}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/[0.08] transition-all z-10"
            >
              <Icon icon="solar:close-circle-linear" width={18} />
            </button>

            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-green-500/60 via-green-500 to-green-500/60" />

            <div className="p-8 md:p-10">
              {/* Badge */}
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-green-500">Beta Access</span>
              </div>

              {/* Heading */}
              <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-3">
                Logic Packs is in beta.
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                We&apos;re building the future of reusable software — and you can be part of it from day one. Apply for early access or join our community to stay in the loop.
              </p>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Link
                  to="/beta"
                  onClick={closeBeta}
                  className="inline-flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-md px-6 py-3.5 text-sm hover:bg-neutral-200 transition-colors"
                >
                  <Icon icon="solar:rocket-2-linear" width={16} />
                  Apply for Beta Access
                </Link>

                <Link
                  to="/ambassador-apply"
                  onClick={closeBeta}
                  className="inline-flex items-center justify-center gap-2 border border-white/[0.1] text-white font-medium rounded-md px-6 py-3.5 text-sm hover:bg-white/[0.05] transition-colors"
                >
                  <Icon icon="solar:medal-ribbon-star-linear" width={16} className="text-green-500" />
                  Apply as Ambassador
                </Link>

                <a
                  href={COMMUNITY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-white/[0.1] text-white font-medium rounded-md px-6 py-3.5 text-sm hover:bg-white/[0.05] transition-colors"
                >
                  <Icon icon="simple-icons:whatsapp" width={16} className="text-green-500" />
                  Join Community
                </a>
              </div>

              {/* Footer note */}
              <p className="text-neutral-700 text-xs font-mono mt-6 text-center">
                Free to join · No spam · Early access perks
              </p>
            </div>
          </div>
        </div>
      )}
    </BetaContext.Provider>
  );
}

