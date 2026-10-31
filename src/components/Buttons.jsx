import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AGENT_PROMPT, LINKS } from '../site';
import { AppleIcon, CheckIcon, TerminalIcon } from './Icons';

const base =
  'inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] font-medium leading-none whitespace-nowrap transition-colors';

export function DownloadButton({ className = '' }) {
  return (
    <Link to={LINKS.download} className={`${base} bg-ink text-page hover:bg-white ${className}`}>
      <AppleIcon className="h-[14px] w-[14px] -translate-y-px" />
      Download for Mac
    </Link>
  );
}

export async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the textarea path (insecure origin, denied permission).
  }
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    el.remove();
    return ok;
  } catch {
    return false;
  }
}

// Copies the paste-in prompt that installs LogicPacks through the visitor's own
// agent (Claude Code, Codex, ...). `onCopied` lets the page show where to paste.
export function AgentButton({ className = '', onCopied }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    const ok = await copyText(AGENT_PROMPT);
    onCopied?.(ok);
    if (!ok) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2500);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      data-copied={copied ? 'true' : 'false'}
      className={`${base} border border-line bg-raised pl-1.5 text-ink hover:border-[#3a3a3a] hover:bg-[#232323] ${className}`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2a2a2a] text-ink">
        {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <TerminalIcon className="h-4 w-4" />}
      </span>
      {copied ? 'Prompt copied' : 'Install with your agent'}
    </button>
  );
}
