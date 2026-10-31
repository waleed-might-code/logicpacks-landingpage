import { Link } from 'react-router-dom';
import { container, display } from '../components/Section';
import { Shipped, Timeline } from '../components/Trust';
import { COMPANY, DEVELOPER, LINKS } from '../site';

export default function Story() {
  return (
    <>
      <section className={`${container} pt-14 sm:pt-20`}>
        <h1 className={display}>
          Our story. <span className="text-muted">A year in the works, eight months of it in testing.</span>
        </h1>
        <p className="mt-5 max-w-[640px] text-[14px] leading-[1.6] text-muted">
          LogicPacks is developed by{' '}
          <a href={DEVELOPER.url} className="text-ink underline decoration-line underline-offset-4">
            {DEVELOPER.name}
          </a>
          , {DEVELOPER.about}, and operated and hosted by {COMPANY.name} in {COMPANY.city}, trading since {COMPANY.since}. We started LogicPacks for our own client work:
          people and their agents in one project, seeing each other work. We opened it to our own team after two months,
          then to labs and tech agencies. It is in public beta now.
        </p>
      </section>
      <section aria-labelledby="timeline-title" className={`${container} pt-12`}>
        <h2 id="timeline-title" className="sr-only">
          Timeline
        </h2>
        <Timeline />
      </section>
      <section aria-labelledby="shipped-title" className={`${container} pt-16`}>
        <h2 id="shipped-title" className="text-[22px] font-normal tracking-[-0.02em] text-ink">
          Shipped with LogicPacks
        </h2>
        <div className="mt-6">
          <Shipped withMedia />
        </div>
      </section>
      <section className={`${container} pb-24 pt-12`}>
        <p className="text-[13px] text-faint">
          How we test it is on the{' '}
          <Link to={LINKS.research} className="text-muted underline decoration-line underline-offset-4 hover:text-ink">
            research page
          </Link>
          .
        </p>
      </section>
    </>
  );
}
