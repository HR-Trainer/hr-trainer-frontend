import CatalogueClient from './CatalogueClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

async function getFormations() {
  try {
    const res = await fetch('http://localhost:5000/api/formations', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch(e) {
    return [];
  }
}

export default async function Catalogue() {
  const formations = await getFormations();
  
  // les formations  publiées
  const publishedFormations = formations.filter((f: any) => f.publie !== false);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f8fafc] font-sans">
        <CatalogueClient formations={publishedFormations} />
      </main>
      <Footer />
    </>
  );
}
