import { spiceIndex } from '../../data/products';

/**
 * A quiet index strip. Duplicated content is aria-hidden and sits in its own
 * track so the loop is seamless without JS.
 */
export function SpiceMarquee({ tone = 'dark' }: { tone?: 'light' | 'dark' }) {
  const items = spiceIndex;
  const color = tone === 'dark' ? 'text-ink/55' : 'text-ivory/45';
  const accent = tone === 'dark' ? 'text-vermilion' : 'text-saffron';

  const Track = ({ hidden = false }: { hidden?: boolean }) => (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={hidden || undefined}
    >
      {items.map((item) => (
        <span key={`${item}-${hidden ? 'b' : 'a'}`} className="flex items-center">
          <span className={`label whitespace-nowrap ${color}`}>{item}</span>
          <span className={`mx-6 text-[0.5rem] ${accent}`}>✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="edge-fade-x overflow-hidden py-5">
      <div className="marquee-track flex w-max">
        <Track />
        <Track hidden />
      </div>
    </div>
  );
}
