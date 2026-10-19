import { useReducedMotion } from './hooks/useReducedMotion';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { SpiceJourney } from './components/SpiceJourney';
import { ProductCollection } from './components/ProductCollection';
import { FlavourInMotion } from './components/FlavourInMotion';
import { CookingStory } from './components/CookingStory';
import { CraftSection } from './components/CraftSection';
import { BrandCampaign } from './components/BrandCampaign';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

export default function App() {
  const reducedMotion = useReducedMotion();

  // Lenis is only instantiated when the visitor has not asked for less motion.
  useSmoothScroll(!reducedMotion);

  return (
    <div className="grain relative min-h-screen bg-ink">
      <Navigation />

      <main id="main">
        <Hero reducedMotion={reducedMotion} />
        <Manifesto reducedMotion={reducedMotion} />
        <SpiceJourney reducedMotion={reducedMotion} />
        <ProductCollection reducedMotion={reducedMotion} />
        <FlavourInMotion reducedMotion={reducedMotion} />
        <CookingStory reducedMotion={reducedMotion} />
        <CraftSection reducedMotion={reducedMotion} />
        <BrandCampaign reducedMotion={reducedMotion} />
        <FinalCTA reducedMotion={reducedMotion} />
      </main>

      <Footer />
    </div>
  );
}
