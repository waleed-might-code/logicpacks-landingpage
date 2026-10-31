import { container, display } from '../components/Section';
import { BENCHMARKS, formatCheck, formatMetric, formatSuite } from '../components/Trust';

function Block({ id, title, intro, children }) {
  return (
    <section aria-labelledby={`${id}-title`} className={`${container} pt-14`}>
      <h2 id={`${id}-title`} className="text-[22px] font-normal tracking-[-0.02em] text-ink">
        {title}
      </h2>
      <p className="mt-2 max-w-[640px] text-[13px] leading-[1.55] text-muted">{intro}</p>
      <div className="mt-6 overflow-hidden rounded-xl border border-line">{children}</div>
    </section>
  );
}

function Row({ title, detail, value, pending, date, testId }) {
  return (
    <div data-testid={testId} className="grid gap-2 border-t border-line bg-panel p-[18px] first:border-t-0 sm:grid-cols-[2fr_1fr] sm:items-center">
      <div>
        <p className="text-[14px] text-ink">{title}</p>
        <p className="mt-1 text-[12px] leading-[1.45] text-faint">{detail}</p>
      </div>
      <div className="sm:text-right">
        <p className={`font-mono text-[14px] ${pending ? 'text-faint' : 'text-ink'}`}>{value}</p>
        {date && <p className="mt-1 font-mono text-[11px] text-faint">{date}</p>}
      </div>
    </div>
  );
}

export default function Research() {
  const b = BENCHMARKS;
  return (
    <>
      <section className={`${container} pt-14 sm:pt-20`}>
        <h1 className={display}>
          Research. <span className="text-muted">What we measure, and the latest results.</span>
        </h1>
        <p className="mt-3 font-mono text-[12px] text-faint">Updated {b.updated}</p>
      </section>
      <Block id="streaming" title="App sharing" intro="How a shared app feels to the person watching or driving it. Numbers appear here when a run finishes.">
        {b.streaming.flatMap((s) =>
          s.metrics.map((m) => (
            <Row
              key={`${s.id}-${m.label}`}
              testId="benchmark"
              title={`${s.title}: ${m.label.toLowerCase()}`}
              detail={s.detail}
              value={formatMetric(m)}
              pending={m.value == null}
            />
          )),
        )}
      </Block>
      <Block id="suites" title="Test suites" intro="Automated runs of the real app, end to end, before a release goes out.">
        {b.suites.map((s) => (
          <Row key={s.id} testId="suite" title={s.title} detail={s.detail} value={formatSuite(s)} date={s.date} />
        ))}
      </Block>
      <Block id="security" title="Member sandbox" intro="Checks that keep members of a cloud workspace apart from the host and from each other.">
        {b.security.map((c) => (
          <Row key={c.id} testId="security-check" title={c.title} detail={c.detail} value={formatCheck(c)} pending={c.result == null} date={c.date} />
        ))}
      </Block>
      <div className="pb-24" />
    </>
  );
}
