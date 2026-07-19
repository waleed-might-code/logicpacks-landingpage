/**
 * Loading placeholder that mirrors the marketplace pack card layout so the
 * grid keeps its shape while data settles. Uses the shared `.lp-skel` shimmer.
 */
export default function PackCardSkeleton() {
  return (
    <div className="p-5 rounded-xl border border-white/[0.06] bg-[#0f0f0f] h-full" aria-hidden="true">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="lp-skel w-9 h-9 rounded-lg" />
          <div className="space-y-2">
            <div className="lp-skel h-3 w-24 rounded" />
            <div className="lp-skel h-2 w-12 rounded" />
          </div>
        </div>
        <div className="lp-skel h-3 w-14 rounded" />
      </div>
      <div className="space-y-2 mb-5">
        <div className="lp-skel h-2.5 w-full rounded" />
        <div className="lp-skel h-2.5 w-4/5 rounded" />
      </div>
      <div className="flex items-center justify-between">
        <div className="lp-skel h-4 w-16 rounded" />
        <div className="lp-skel h-2.5 w-20 rounded" />
      </div>
    </div>
  );
}
