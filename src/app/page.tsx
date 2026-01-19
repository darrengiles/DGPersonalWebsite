import type { About } from '@/types';
import aboutData from '@/../public/content/about.json';
import PixelWave from '@/components/PixelWave';

export default function Home() {
  const about = aboutData as About;

  return (
    <div className="page-container home-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', position: 'relative' }}>
      <h1 style={{ fontSize: '5rem', textAlign: 'center', zIndex: 10 }}>{about.name}</h1>
      <PixelWave />
    </div>
  );
}
