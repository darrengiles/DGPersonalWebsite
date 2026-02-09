import type { About } from '@/types';
import aboutData from '@/../public/content/about.json';
import PixelWave from '@/components/PixelWave';
import FloatingTitle from '@/components/FloatingTitle';

export default function Home() {
  const about = aboutData as About;

  return (
    <div className="page-container home-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', position: 'relative' }}>
      <FloatingTitle name={about.name} />
      <PixelWave />
    </div>
  );
}
