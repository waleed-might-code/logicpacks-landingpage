import benchmarks from '../../research/benchmarks.json';
import { SHIPPED, STORY } from '../site';
import MediaSlot from './MediaSlot';

// Pieces shared by the landing page, /story and /research.

export function Timeline({ items = STORY, compact = false }) {
  return (
    <ol className={`grid gap-px overflow-hidden rounded-xl border border-line bg-line ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-4'}`}>
      {items.map((item) => (
        <li key={item.when} data-testid="story-step" className="bg-panel p-[18px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-faint">{item.when}</p>
          <p className="mt-2 text-[14px] text-ink">{item.title}</p>
          {!compact && <p className="mt-1 text-[12px] leading-[1.45] text-faint">{item.body}</p>}
        </li>
      ))}
    </ol>
  );
}

export function ShippedCard({ item, withMedia = false }) {
  return (
    <li data-testid="shipped-card" className="flex flex-col overflow-hidden rounded-xl border border-line bg-panel">
      {withMedia && item.id === 'taas' && (
        <MediaSlot video={item.video ?? undefined} poster={item.poster} label="TAAS film" placeholder="Film coming" width={1600} height={900} />
      )}
      <div className="flex flex-1 flex-col p-[18px]">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-faint">{item.kind}</p>
        <p className="mt-2 text-[15px] text-ink">{item.title}</p>
        <p className="mt-1 text-[12px] leading-[1.5] text-muted">{item.body}</p>
        <p className="mt-auto pt-4 text-[12px] text-faint">{item.client}</p>
      </div>
    </li>
  );
}

export function Shipped({ withMedia = false }) {
  return (
    <ul aria-label="Shipped with LogicPacks" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {SHIPPED.map((item) => (
        <ShippedCard key={item.id} item={item} withMedia={withMedia} />
      ))}
    </ul>
  );
}

export const BENCHMARKS = benchmarks;

export const formatMetric = (m) => (m.value == null ? 'Benchmark running' : `${m.value} ${m.unit}`);
export const formatSuite = (s) => `${s.passed}/${s.total} passed`;
export const formatCheck = (c) => c.result ?? 'Check running';

// A small snapshot for the landing page: test suites passed, sandbox checks, and
// the streaming benchmarks (or "Benchmark running").
export function ResearchSnapshot() {
  const suites = BENCHMARKS.suites;
  const passed = suites.reduce((n, s) => n + s.passed, 0);
  const total = suites.reduce((n, s) => n + s.total, 0);
  const checks = BENCHMARKS.security.filter((c) => c.result != null).length;
  const stream = BENCHMARKS.streaming[0];
  const cells = [
    { label: 'End to end and server tests', value: `${passed}/${total} passed` },
    { label: 'Member sandbox checks', value: `${checks} of ${BENCHMARKS.security.length} published` },
    { label: `${stream.title}, ${stream.metrics[0].label.toLowerCase()}`, value: formatMetric(stream.metrics[0]) },
  ];
  return (
    <dl data-testid="research-snapshot" className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
      {cells.map((c) => (
        <div key={c.label} className="bg-panel p-[18px]">
          <dt className="text-[12px] text-faint">{c.label}</dt>
          <dd className="mt-2 font-mono text-[15px] text-ink">{c.value}</dd>
        </div>
      ))}
    </dl>
  );
}
