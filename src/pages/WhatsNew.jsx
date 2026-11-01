import { BetaPill, container, display, Facts } from '../components/Section';
import { Link } from 'react-router-dom';
import MediaSlot from '../components/MediaSlot';
import { EVERY_APP_MEDIA, EXPERT_PORTRAITS_READY, EXPERTS, expertPortrait, FREELANCERS, LINKS } from '../site';

const EVERY_APP = [
  { title: 'The same machine', body: 'Open the host’s apps with the same profiles. No VM.' },
  { title: 'A cursor for everyone', body: 'Live app views with a named cursor for each person and agent.' },
  { title: 'Snapshots that merge back', body: 'Work on a copy, then replay it as steps and settle conflicts.' },
];

const ASSIST = [
  { title: 'A curated panel', body: 'Freelancers vetted by LogicPacks, each with what they are good at. Pick one and add them to the project.' },
  { title: 'Your own subscription', body: 'The expert works through your Claude or Codex login, inside your project, where you can watch.' },
  { title: 'Delegate to a human', body: 'Hand a thread to an expert straight from LogicPacks, the way you hand one to an agent.' },
];

// A dark card with a cut-out portrait standing on the card ground, the name over the
// bottom of the portrait, then the role, one line and a profile link.
function ExpertCard({ expert }) {
  return (
    <li data-testid="expert-card" className="group flex flex-col overflow-hidden rounded-xl border border-line bg-panel">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={expertPortrait(expert.id)}
          alt={`Illustrative portrait for the sample expert ${expert.name}`}
          loading="lazy"
          width="480"
          height="600"
          className="absolute inset-x-0 bottom-0 mx-auto h-[94%] w-auto max-w-none object-contain object-bottom grayscale transition duration-300 group-hover:grayscale-0"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-panel via-panel/70 to-transparent" />
        <p className="absolute bottom-3 left-4 right-4 text-[17px] leading-tight tracking-[-0.01em] text-ink sm:text-[19px]">
          {expert.name}
        </p>
      </div>
      <div className="flex flex-1 flex-col border-t border-line px-4 pb-4 pt-3">
        <p className="text-[13px] font-semibold text-ink">{expert.role}</p>
        <p className="mt-1 text-[12px] leading-[1.45] text-faint">{expert.line}</p>
        <a
          href={LINKS.download}
          className="mt-auto flex items-center justify-between pt-4 text-[12px] text-muted transition-colors hover:text-ink"
        >
          View profile <span aria-hidden="true">→</span>
        </a>
      </div>
    </li>
  );
}

export default function WhatsNew() {
  return (
    <>
      <section className={`${container} pt-16 sm:pt-24`}>
        <h1 className={display}>
          What&rsquo;s new. <span className="text-muted">New releases in LogicPacks, newest first.</span>
        </h1>
      </section>

      <article id="request-assistance" aria-labelledby="assist-title" className={`${container} pb-20 pt-16 sm:pt-20`}>
        <div className="flex items-center gap-3">
          <BetaPill />
          <p className="text-[12px] text-faint">November 2026</p>
        </div>
        <h2 id="assist-title" className={`${display} mt-6`}>
          Request assistance.{' '}
          <span className="text-muted">When an agent is not enough, add an expert who gets it done for you.</span>
        </h2>
        <p className="mt-5 max-w-[680px] text-[14px] leading-[1.6] text-muted">
          We remove the complex parts so you just get it done. {FREELANCERS}{' '}
          <Link to={LINKS.pricing} className="text-ink underline decoration-line underline-offset-4">
            See pricing
          </Link>
          .
        </p>
        <div className="mt-8 overflow-hidden rounded-xl border border-line bg-panel">
          <Facts items={ASSIST} bordered={false} />
        </div>
        {EXPERT_PORTRAITS_READY && (
          <>
            <ul aria-label="Sample experts" className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {EXPERTS.map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-faint">Sample experts. Portraits are illustrative.</p>
          </>
        )}
      </article>

      <article id="every-app" aria-labelledby="every-app-title" className={`${container} border-t border-line pb-24 pt-16 sm:pt-20`}>
        <div className="flex items-center gap-3">
          <BetaPill />
          <p className="text-[12px] text-faint">October 2026</p>
        </div>
        <h2 id="every-app-title" className={`${display} mt-6`}>
          Every app, every agent, one machine.{' '}
          <span className="text-muted">
            People and agents share the host&rsquo;s apps, from Blender to DaVinci Resolve, and see each other work.
          </span>
        </h2>
        <div className="mt-8 overflow-hidden rounded-xl border border-line bg-panel">
          <MediaSlot
            video={EVERY_APP_MEDIA.video}
          webm={EVERY_APP_MEDIA.webm}
            poster={EVERY_APP_MEDIA.poster}
            alt={EVERY_APP_MEDIA.alt}
            width={1600}
            height={900}
            label="Demo footage of shared apps"
            placeholder="Beta demo"
          />
          <Facts items={EVERY_APP} />
        </div>
        <p className="mt-3 text-[12px] text-faint">Other recipes need the Mac app.</p>
      </article>
    </>
  );
}
