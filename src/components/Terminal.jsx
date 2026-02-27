export default function Terminal({ title = 'Terminal', children, className = '' }) {
  return (
    <div className={`terminal ${className}`}>
      <div className="terminal-bar">
        <div className="terminal-dot bg-[#ff5f57]" />
        <div className="terminal-dot bg-[#febc2e]" />
        <div className="terminal-dot bg-[#28c840]" />
        {title && <span className="text-neutral-600 text-[10px] font-mono ml-2">{title}</span>}
      </div>
      <div className="terminal-body">
        <code>{children}</code>
      </div>
    </div>
  );
}

