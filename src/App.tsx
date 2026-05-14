import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ArticleIntro from './components/ArticleIntro';
import QuestionsSection from './components/QuestionsSection';
import GaliciaCastrosMap from './components/GaliciaCastrosMap';
import DataSection from './components/DataSection';
import Timeline from './components/Timeline';
import CastroDiagram from './components/CastroDiagram';
import CaseStudies from './components/CaseStudies';
import SponsorRuela from './components/SponsorRuela';
import FooterSources from './components/FooterSources';
import { castros, contextualCastroPoints, type Castro } from './data/castros';

export default function App() {
  const [selectedCastro, setSelectedCastro] = useState<Castro | null>(null);

  return (
    <div className="app">
        <Header />
      <main>
        <Hero />
        <ArticleIntro />
        <QuestionsSection />
        <GaliciaCastrosMap
          castros={castros}
          contextualCastros={contextualCastroPoints}
          selectedCastro={selectedCastro}
          onSelectCastro={setSelectedCastro}
        />
        <DataSection castros={castros} />
        <Timeline />
        <CastroDiagram />
        <CaseStudies />
        <SponsorRuela />
      </main>
      <FooterSources />
    </div>
  );
}
