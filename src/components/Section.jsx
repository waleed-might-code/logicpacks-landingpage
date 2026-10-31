// Layout pieces shared by the landing page and /new.
export const container = 'mx-auto w-full max-w-site px-4 sm:px-8';
export const display = 'text-[28px] font-normal leading-[1.12] tracking-[-0.025em] sm:text-[38px]';
// Hairlines between grid cells: stacked on phones, side by side from sm up.
export const divided = (i) => (i > 0 ? 'border-t border-line sm:border-l sm:border-t-0' : '');

export function BetaPill({ children = 'Beta' }) {
  return (
    <p className="inline-flex h-7 items-center rounded-full border border-line bg-raised px-3 text-[12px] text-muted">
      {children}
    </p>
  );
}

// Three short facts under a section's media, hairline-divided like the sync facts.
export function Facts({ items, bordered = true }) {
  return (
    <div className={`grid sm:grid-cols-3 ${bordered ? 'border-t border-line' : ''}`}>
      {items.map((item, i) => (
        <div key={item.title} className={`p-[18px] ${divided(i)}`}>
          <p className="text-[13px] text-ink">{item.title}</p>
          <p className="mt-1 text-[12px] leading-[1.45] text-faint">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
