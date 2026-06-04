import React from 'react';
import { Hero } from '../../components/Hero';
import { OperatingPhilosophy } from '../../components/OperatingPhilosophy';
import { ImageGrid } from '../../components/ImageGrid';
import { AboutSection } from '../../components/AboutSection';
import { LandDataForm } from '../../components/LandDataForm';

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <OperatingPhilosophy />
      <ImageGrid />
      <AboutSection />
      <LandDataForm />
    </main>
  );
}
