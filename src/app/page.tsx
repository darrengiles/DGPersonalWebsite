import type { About } from '@/types';
import aboutData from '@/../public/content/about.json';

export default function Home() {
  const about = aboutData as About;

  return (
    <div className="page-container home-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <h1 style={{ fontSize: '5rem', textAlign: 'center' }}>{about.name}</h1>
    </div>
  );
}
