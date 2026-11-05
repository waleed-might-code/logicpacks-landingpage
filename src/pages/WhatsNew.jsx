import { BetaPill, container, display, Facts } from '../components/Section';
import { Link } from 'react-router-dom';
import MediaSlot from '../components/MediaSlot';
import { EVERY_APP_MEDIA, LINKS } from '../site';

const EVERY_APP = [
  { title: 'The same machine', body: 'Open the host’s apps with the same profiles. No VM.' },
  { title: 'A cursor for everyone', body: 'Live app views with a named cursor for each person and agent.' },
  { title: 'Snapshots that merge back', body: 'Work on a copy, then replay it as steps and settle conflicts.' },
];

const WINDOWS = [
  { title: 'One line, no admin', body: 'Paste one line in PowerShell. It installs for your user, checks the file and puts lp on your PATH.' },
  { title: 'Your own agents', body: 'It uses the Claude Code or Codex already on your PC, and lp connects your terminal agent to the app.' },
  { title: 'Share on your network', body: 'Turn on Network access in Settings and send a project link to people on the same network.' },
];

export default function WhatsNew() {
  return (
    <>
      <section className={`${container} pt-16 sm:pt-24`}>
        <h1 className={display}>
          What&rsquo;s new. <span className="text-muted">New releases in LogicPacks, newest first.</span>
        </h1>
      </section>

      <article id="windows" aria-labelledby="windows-title" className={`${container} pb-20 pt-16 sm:pt-20`}>
        <p className="text-[12px] text-faint">November 2026</p>
        <h2 id="windows-title" className={`${display} mt-6`}>
          LogicPacks for Windows.{' '}
          <span className="text-muted">The same shared project, on Windows 10 and 11.</span>
        </h2>
        <p className="mt-5 max-w-[680px] text-[14px] leading-[1.6] text-muted">
          The Windows app is not code-signed yet, so Windows SmartScreen may ask before it runs a downloaded installer.{' '}
          <Link to={LINKS.download} className="text-ink underline decoration-line underline-offset-4">
            See the install steps
          </Link>
          .
        </p>
        <div className="mt-8 overflow-hidden rounded-xl border border-line bg-panel">
          <Facts items={WINDOWS} bordered={false} />
        </div>
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
