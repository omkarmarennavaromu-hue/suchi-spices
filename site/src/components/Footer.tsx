import { ArrowUp } from 'lucide-react';
import { scrollToSection } from '../hooks/useSmoothScroll';

const YEAR = new Date().getFullYear();

const NAV = [
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'journey', label: 'The journey' },
  { id: 'motion', label: 'Flavour in motion' },
  { id: 'cooking', label: 'Cooking' },
  { id: 'craft', label: 'Ingredients & craft' },
  { id: 'campaign', label: 'The range' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-ivory/15 bg-ink pb-8 pt-16 text-ivory">
      <div className="shell">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <button
              type="button"
              onClick={() => scrollToSection('top')}
              className="block text-left"
              aria-label="Back to the top of the page"
            >
              <span className="display block text-[clamp(2.6rem,6.6vw,5.4rem)] leading-[0.85]">
                Suchi
                <br />
                <span className="serif-accent text-saffron">Spices</span>
              </span>
            </button>
            <p className="mt-7 max-w-[34ch] text-[0.875rem] leading-relaxed text-ivory/50">
              A universe of flavour — sixteen whole spices, four blends, and one
              photographic language built for the way Indian cooking actually behaves.
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-8">
            <p className="label-sm mb-5 text-ivory/35">Sections</p>
            <ul className="space-y-3">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className="link-line hit text-[0.875rem] text-ivory/65 transition-colors duration-300 hover:text-ivory"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2 lg:col-start-11">
            <p className="label-sm mb-5 text-ivory/35">Collection</p>
            <a
              href="#collection"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('collection');
              }}
              className="link-line hit text-[0.875rem] text-ivory/65 transition-colors duration-300 hover:text-ivory"
            >
              Four blends
            </a>
            <p className="mt-8 label-sm text-ivory/25">Vol. 01</p>
            <p className="mt-2 text-[0.75rem] leading-relaxed text-ivory/35">
              Concept packaging
              <br />
              Portfolio piece
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-ivory/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.6875rem] leading-relaxed text-ivory/35">
            © {YEAR} Suchi Spices — a fictional brand. All packaging, copy and products
            shown are concept work created for a portfolio demonstration. Not a real
            store; nothing is for sale.
          </p>
          <button
            type="button"
            onClick={() => scrollToSection('top')}
            className="group inline-flex shrink-0 items-center gap-3 border border-ivory/20 px-4 py-3 transition-colors duration-400 hover:border-saffron hover:text-saffron"
          >
            <span className="label-sm">Back to top</span>
            <ArrowUp
              size={13}
              strokeWidth={1.6}
              className="transition-transform duration-400 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
