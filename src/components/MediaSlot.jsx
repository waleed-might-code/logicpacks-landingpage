import { useState } from 'react';

// A media frame that is ready for a video before the video exists. The image
// (or, without one, a plain placeholder) always renders; if `video` loads, it
// fades in over the top. A missing file, or the SPA fallback answering with
// HTML, just errors quietly and the still stays.
export default function MediaSlot({
  video,
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
}) {
  const [videoReady, setVideoReady] = useState(false);
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
          <source src={video} type="video/mp4" onError={() => setVideoReady(false)} />
        </video>
      )}
    </div>
  );
}
