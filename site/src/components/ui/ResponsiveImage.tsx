import { useCallback, useRef, useState } from 'react';
import { assets, imageSources, type AssetKey } from '../../data/assets';

interface ResponsiveImageProps {
  asset: AssetKey;
  alt: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  /** Above-the-fold images should opt out of lazy loading. */
  priority?: boolean;
  /** Decorative images get empty alt and are skipped by screen readers. */
  decorative?: boolean;
}

/**
 * <picture> with WebP + JPEG sources at the three widths actually encoded on
 * disk, intrinsic width/height to hold layout, and the 20px LQIP painting
 * underneath until the real file decodes.
 */
export function ResponsiveImage({
  asset,
  alt,
  sizes = '100vw',
  className = '',
  imgClassName = '',
  priority = false,
  decorative = false,
}: ResponsiveImageProps) {
  const meta = assets[asset];
  const { webp, jpeg, fallback } = imageSources(asset);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // A cached image can finish before React attaches onLoad.
  const handleRef = useCallback((node: HTMLImageElement | null) => {
    imgRef.current = node;
    if (node?.complete) setLoaded(true);
  }, []);

  return (
    <div
      className={`relative overflow-hidden bg-ink-2 ${className}`}
      style={{ backgroundColor: meta.dominant }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 scale-105 bg-cover bg-center blur-xl transition-opacity duration-700"
        style={{
          backgroundImage: `url(${meta.lqip})`,
          opacity: loaded ? 0 : 1,
        }}
      />
      <picture>
        <source type="image/webp" srcSet={webp} sizes={sizes} />
        <source type="image/jpeg" srcSet={jpeg} sizes={sizes} />
        <img
          ref={handleRef}
          src={fallback}
          alt={decorative ? '' : alt}
          aria-hidden={decorative ? true : undefined}
          width={meta.width}
          height={meta.height}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-[900ms] ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      </picture>
    </div>
  );
}
