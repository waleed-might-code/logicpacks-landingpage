import { useRef, useState } from 'react';

// A media frame that is ready for a video before the video exists. The image
// (or, without one, a plain placeholder) always renders; if `video` loads, it
// fades in over the top. A missing file, or the SPA fallback answering with
// HTML, just errors quietly and the still stays.
export default function MediaSlot({
  video,
  webm,
  poster,
  image,
  imageWebp,
  alt = '',
  width = 2400,
  height = 1500,
  label,
  placeholder,
  className = '',
  priority = false,
  soundToggle = false,
}) {
  const [videoReady, setVideoReady] = useState(false);
  const [withSound, setWithSound] = useState(false);
  const videoRef = useRef(null);

  // The film autoplays muted; one click restarts it with its voiceover.
  const playWithSound = () => {
    const el = videoRef.current;
    if (!el) return;
    const next = !withSound;
    el.muted = !next;
    if (next) {
      el.currentTime = 0;
      el.play().catch(() => {});
    }
    setWithSound(next);
  };
  const still = image ?? poster;

  return (
    <div className={`relative overflow-hidden bg-page ${className}`}>
      {still ? (
        <picture>
          {imageWebp && <source srcSet={imageWebp} type="image/webp" />}
          <img
            src={still}
            alt={alt}
            width={width}
            height={height}
            className="block h-auto w-full"
            loading={priority ? undefined : 'lazy'}
            fetchpriority={priority ? 'high' : undefined}
          />
        </picture>
      ) : (
        <div
          role="img"
          aria-label={label}
          className={`flex w-full items-center justify-center text-[13px] text-faint ${videoReady ? 'aspect-[16/9]' : 'aspect-[16/9] sm:aspect-[3/1]'}`}
        >
          {placeholder}
        </div>
      )}
      {video && (
        <video
          ref={videoRef}
          data-testid="media-video"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${videoReady ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          poster={still ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={label}
          aria-hidden={videoReady ? undefined : 'true'}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
        >
          {webm && <source src={webm} type="video/webm" />}
          <source src={video} type="video/mp4" onError={() => setVideoReady(false)} />
        </video>
      )}
      {video && soundToggle && videoReady && (
        <button
          type="button"
          data-testid="media-sound"
          onClick={playWithSound}
          aria-pressed={withSound}
          className="absolute bottom-3 right-3 rounded-full border border-[#3a3a3a] bg-page/85 px-3 py-1.5 text-[12px] text-ink backdrop-blur hover:bg-raised"
        >
          {withSound ? 'Mute' : 'Play with sound'}
        </button>
      )}
    </div>
  );
}
