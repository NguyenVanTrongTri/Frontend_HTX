import React from 'react';
import { Hero } from '../components/Hero';
import { CustomerHero } from '../components/CustomerHero';
import { AboutSection } from '../components/AboutSection';
import { ImageGrid } from '../components/ImageGrid';

export default function CustomerLandingPage() {
  return (
    <main>
      <CustomerHero />
      <ImageGrid />
      <AboutSection />
    </main>
  );
}
