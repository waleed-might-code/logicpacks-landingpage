import { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';

const ACCESS_CODE = 'buildanything';
const CODE_LENGTH = ACCESS_CODE.length; // 13
const STORAGE_KEY = 'lp_access_granted';

// Split into two visual groups: "build" (5) + "anything" (8)
const GROUP_SPLIT = 5;

export default function AccessGate({ children }) {
  const [granted, setGranted] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  });
  const [chars, setChars] = useState(Array(CODE_LENGTH).fill(''));
  const [shakeError, setShakeError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [revealIndex, setRevealIndex] = useState(-1);
  const inputRefs = useRef([]);

  // Focus first empty input on mount
  useEffect(() => {
    if (!granted) {
      const timer = setTimeout(() => {
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [granted]);

  const checkCode = useCallback((updatedChars) => {
    const entered = updatedChars.join('');
    if (entered.length === CODE_LENGTH) {
      if (entered.toLowerCase() === ACCESS_CODE) {
        // Correct — run reveal animation then grant access
        setUnlocking(true);
        let i = 0;
        const interval = setInterval(() => {
          setRevealIndex(i);
          i++;
          if (i >= CODE_LENGTH) {
            clearInterval(interval);
            setTimeout(() => {
              sessionStorage.setItem(STORAGE_KEY, 'true');
              setGranted(true);
            }, 600);
          }
        }, 60);
      } else {
        // Wrong — shake and clear
        setShakeError(true);
        setTimeout(() => {
          setShakeError(false);
          setChars(Array(CODE_LENGTH).fill(''));
          if (inputRefs.current[0]) inputRefs.current[0].focus();
        }, 500);
      }
    }
  }, []);

  const handleChange = (index, value) => {
    if (unlocking) return;
    // Only accept single alpha character
    const char = value.slice(-1).toLowerCase();
    if (char && !/^[a-z]$/.test(char)) return;

    const updated = [...chars];
    updated[index] = char;
    setChars(updated);

    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    checkCode(updated);
  };

  const handleKeyDown = (index, e) => {
    if (unlocking) return;
    if (e.key === 'Backspace') {
      e.preventDefault();
      const updated = [...chars];
      if (chars[index]) {
        updated[index] = '';
        setChars(updated);
      } else if (index > 0) {
        updated[index - 1] = '';
        setChars(updated);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    if (unlocking) return;
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').toLowerCase().replace(/[^a-z]/g, '');
    if (!pasted) return;
    const updated = [...chars];
    for (let i = 0; i < Math.min(pasted.length, CODE_LENGTH); i++) {
      updated[i] = pasted[i];
    }
    setChars(updated);
    const nextEmpty = updated.findIndex((c) => !c);
    const focusIdx = nextEmpty === -1 ? CODE_LENGTH - 1 : nextEmpty;
    inputRefs.current[focusIdx]?.focus();
    checkCode(updated);
  };

  if (granted) return children;

  const filledCount = chars.filter((c) => c).length;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#0a0a0a] flex items-center justify-center overflow-y-auto overflow-x-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] sm:w-[60vw] md:w-[40vw] h-[80vw] sm:h-[60vw] md:h-[40vw] bg-green-500/[0.03] blur-[100px] sm:blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] sm:[background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12 w-full max-w-2xl min-h-full sm:min-h-0">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 mb-6 sm:mb-8 md:mb-12 opacity-0 translate-y-4"
          style={{ animation: 'accessFadeIn 0.8s 0.1s cubic-bezier(0.2,0.8,0.2,1) forwards' }}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-white/10 flex items-center justify-center bg-white/[0.03]">
            <Icon icon="solar:widget-5-linear" className="text-green-500 text-sm sm:text-base" />
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-tight text-white">Logic Packs</span>
        </div>

        {/* Lock icon */}
        <div
          className="mb-4 sm:mb-6 opacity-0 translate-y-4"
          style={{ animation: 'accessFadeIn 0.8s 0.2s cubic-bezier(0.2,0.8,0.2,1) forwards' }}
        >
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center transition-all duration-500 ${
            unlocking
              ? 'bg-green-500/15 border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.15)]'
              : 'bg-white/[0.03] border-white/[0.08]'
          }`}>
            <Icon
              icon={unlocking ? 'solar:lock-unlocked-linear' : 'solar:lock-keyhole-linear'}
              className={`text-xl sm:text-2xl transition-colors duration-500 ${unlocking ? 'text-green-500' : 'text-neutral-500'}`}
            />
          </div>
        </div>

        {/* Title */}
        <div
          className="text-center mb-1.5 sm:mb-2 opacity-0 translate-y-4"
          style={{ animation: 'accessFadeIn 0.8s 0.3s cubic-bezier(0.2,0.8,0.2,1) forwards' }}
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight px-2">
            {unlocking ? 'Access Granted' : 'Enter Access Code'}
          </h1>
        </div>

        <div
          className="text-center mb-6 sm:mb-8 md:mb-10 opacity-0 translate-y-4"
          style={{ animation: 'accessFadeIn 0.8s 0.4s cubic-bezier(0.2,0.8,0.2,1) forwards' }}
        >
          <p className="text-neutral-600 text-xs sm:text-sm font-mono px-4">
            {unlocking ? 'Initializing workspace...' : 'This platform is in private beta'}
          </p>
        </div>

        {/* Character inputs */}
        <div
          className={`flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 md:gap-2 mb-6 sm:mb-8 px-2 opacity-0 translate-y-4 ${shakeError ? 'access-shake' : ''}`}
          style={{ animation: 'accessFadeIn 0.8s 0.5s cubic-bezier(0.2,0.8,0.2,1) forwards' }}
        >
          {chars.map((char, i) => {
            const isRevealed = unlocking && i <= revealIndex;
            const isFilled = !!char;
            const isActive = !unlocking && document.activeElement === inputRefs.current[i];

            return (
              <div key={i} className="flex items-center">
                {i === GROUP_SPLIT && (
                  <div className="w-1.5 sm:w-2 md:w-3 flex items-center justify-center">
                    <span className="text-neutral-800 text-[10px] sm:text-xs">·</span>
                  </div>
                )}
                <input
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  maxLength={1}
                  value={char}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  disabled={unlocking}
                  className={`
                    w-9 h-11 sm:w-10 sm:h-12 md:w-11 md:h-14
                    text-center font-mono text-base sm:text-base md:text-lg font-medium
                    rounded-lg border outline-none
                    transition-all duration-200
                    touch-manipulation
                    ${isRevealed
                      ? 'bg-green-500/15 border-green-500/30 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.15)]'
                      : isFilled
                        ? 'bg-white/[0.06] border-white/15 text-white'
                        : 'bg-white/[0.02] border-white/[0.06] text-white'
                    }
                    focus:border-green-500/40 focus:bg-white/[0.04] focus:shadow-[0_0_0_3px_rgba(34,197,94,0.08)]
                    placeholder:text-neutral-800
                    disabled:cursor-default
                  `}
                  aria-label={`Character ${i + 1} of ${CODE_LENGTH}`}
                />
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div
          className="w-full max-w-xs mb-4 sm:mb-6 px-4 opacity-0 translate-y-4"
          style={{ animation: 'accessFadeIn 0.8s 0.6s cubic-bezier(0.2,0.8,0.2,1) forwards' }}
        >
          <div className="h-px bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${(filledCount / CODE_LENGTH) * 100}%`,
                background: unlocking
                  ? '#22c55e'
                  : filledCount > 0
                    ? 'rgba(34,197,94,0.5)'
                    : 'transparent',
              }}
            />
          </div>
        </div>

        {/* Hint */}
        <div
          className="opacity-0 translate-y-4 px-4"
          style={{ animation: 'accessFadeIn 0.8s 0.7s cubic-bezier(0.2,0.8,0.2,1) forwards' }}
        >
          <div className="flex items-center gap-1.5 sm:gap-2 justify-center flex-wrap">
            <span className="flex h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500/50" />
            <span className="text-neutral-700 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.15em] text-center">
              {CODE_LENGTH} characters · alpha only
            </span>
          </div>
        </div>

        {/* DM for access link */}
        <div
          className="mt-6 sm:mt-8 opacity-0 translate-y-4 px-4"
          style={{ animation: 'accessFadeIn 0.8s 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards' }}
        >
          <a
            href="https://www.linkedin.com/in/waleed-ajmal/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-neutral-400 hover:text-white active:text-white active:bg-white/[0.06] hover:border-white/15 hover:bg-white/[0.04] transition-all group touch-manipulation"
          >
            <Icon icon="simple-icons:linkedin" className="text-sm group-hover:text-[#0077b5] transition-colors" />
            <span className="text-xs font-medium">DM for access</span>
            <Icon icon="solar:arrow-right-up-linear" className="text-[10px] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>
        </div>
      </div>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes accessFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .access-shake {
          animation: accessShake 0.4s ease-in-out;
        }
        @keyframes accessShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

