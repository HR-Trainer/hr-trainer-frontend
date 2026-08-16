import Link from 'next/link';
import { ArrowRight, Check, Play, BookOpen, BarChart, BrainCircuit, Building, User, Zap, Star } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

//récupération les données 
async function getFormations() {
  try {
    const res = await fetch('http://localhost:5000/api/formations', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch(e) {
    return [];
  }
}

const translateLevel = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'débutant': return 'Beginner';
    case 'intermédiaire': return 'Intermediate';
    case 'avancé': return 'Advanced';
    default: return level || 'Beginner';
  }
};

export default async function Home() {
  const formations = await getFormations();
  const t = await getTranslations('Home');
  
  // couleurs  cartes
  const cardThemes = [
    { bg: 'bg-[#7E57C2]', icon: BookOpen, badgeRight: 'Popular' },
    { bg: 'bg-[#0088FF]', icon: BarChart, badgeRight: 'New' },
    { bg: 'bg-[#00C48C]', icon: BrainCircuit, badgeRight: null }
  ];

  return (
    <>
    <main className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 text-slate-900 dark:text-white font-sans overflow-x-hidden transition-colors">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold mb-8 transition-colors">
            <Zap size={16} className="fill-blue-600 dark:fill-blue-400" /> {t('heroBadge')}
          </div>
          <h1 className="text-5xl md:text-[4.5rem] font-extrabold leading-[1.1] tracking-tight mb-8 text-slate-900 dark:text-white transition-colors">
            {t('heroTitle1')} <br />
            <span className="text-blue-600 dark:text-blue-400">{t('heroTitle2')}</span><br />
            {t('heroTitle3')}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed pr-8 font-medium transition-colors">
            {t('heroDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/formations" className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-600/30">
              {t('heroBtnPrimary')} &rarr;
            </Link>
            <Link href="/entreprises" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm px-8 py-3.5 rounded-xl font-semibold flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              {t('heroBtnSecondary')}
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5"><Check size={16} className="text-blue-500" /> {t('heroCheck1')}</span>
            <span className="flex items-center gap-1.5"><Check size={16} className="text-blue-500" /> {t('heroCheck2')}</span>
            <span className="flex items-center gap-1.5"><Check size={16} className="text-blue-500" /> {t('heroCheck3')}</span>
          </div>
        </div>

        {/* Hero Right - UI Mockup */}
        <div className="relative hidden lg:block">
          {/* Lueur d'arrière-plan */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl -z-10 transition-colors"></div>
          
          {/* Fenêtre de Chat */}
          <div className="bg-white dark:bg-slate-900 rounded-[1.25rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden w-full max-w-[500px] mx-auto relative z-10 transition-colors">
            {/* Header */}
            <div className="border-b border-slate-100 dark:border-slate-800 p-4 pb-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0066FF] rounded-full flex items-center justify-center shadow-sm">
                <BrainCircuit size={20} className="text-white" />
              </div>
              <div>
                <div className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight">HR-Trainer AI Coach</div>
                <div className="text-[12px] text-emerald-500 font-bold flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Online
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
              </div>
            </div>
            
            {/* Chat Body */}
            <div className="p-6 space-y-6 bg-[#f8fafc] dark:bg-slate-900 transition-colors">
              {/* Message AI 1 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0066FF] flex-shrink-0 flex items-center justify-center mt-1 shadow-sm">
                  <BrainCircuit size={16} className="text-white" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 p-4 rounded-2xl rounded-tl-sm text-[14.5px] text-slate-700 dark:text-slate-300 shadow-sm leading-relaxed max-w-[85%] transition-colors">
                  Welcome back, Sarah! Ready to continue <Link href="#" className="text-[#0066FF] dark:text-blue-400 font-bold hover:underline">Employment Law Basics</Link>? You left off at Module 3.
                </div>
              </div>

              {/* Message User */}
              <div className="flex gap-4 justify-end">
                <div className="bg-[#0066FF] text-white px-5 py-3.5 rounded-2xl rounded-tr-sm text-[14.5px] font-bold shadow-md max-w-[80%] leading-relaxed">
                  Yes! Can you quiz me on the GDPR section first?
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center mt-1 text-xs font-bold text-[#0066FF] dark:text-blue-400 transition-colors">
                  S
                </div>
              </div>

              {/* Message AI 2 (Quiz) */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0066FF] flex-shrink-0 flex items-center justify-center mt-1 shadow-sm">
                  <BrainCircuit size={16} className="text-white" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 p-4 rounded-2xl rounded-tl-sm shadow-sm w-full transition-colors">
                  <p className="text-[14.5px] text-slate-900 dark:text-white mb-4 font-medium">Under GDPR, what is the maximum fine for a Tier 2 violation?</p>
                  <div className="space-y-2.5">
                    <button className="w-full text-left px-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-600 bg-[#eff4fa] dark:bg-slate-700 text-[14px] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium transition shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">€10M or 2% of global turnover</button>
                    <button className="w-full text-left px-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-600 bg-[#eff4fa] dark:bg-slate-700 text-[14px] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium transition shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">€20M or 4% of global turnover</button>
                    <button className="w-full text-left px-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-600 bg-[#eff4fa] dark:bg-slate-700 text-[14px] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium transition shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">€5M or 1% of global turnover</button>
                  </div>
                </div>
              </div>
              
              {/* Message AI 3  */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0066FF] flex-shrink-0 flex items-center justify-center shadow-sm">
                  <BrainCircuit size={16} className="text-white" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1 shadow-sm transition-colors">
                  <div className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>

            {/* Input area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-3 transition-colors">
              <input type="text" placeholder="Ask HR-Trainer anything..." className="flex-grow bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-5 py-3 text-[14px] text-slate-700 dark:text-slate-300 outline-none focus:border-[#0066FF] transition-colors" disabled />
              <button className="w-11 h-11 rounded-full bg-[#0066FF] flex items-center justify-center flex-shrink-0 shadow-md">
                <ArrowRight size={18} className="text-white" />
              </button>
            </div>
            
            {/* Floating Badges */}
            <div className="absolute -left-14 top-[35%] bg-white dark:bg-slate-800 rounded-[1.25rem] shadow-xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-700 p-3.5 flex items-center gap-4 transform -translate-y-1/2 transition-colors">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-2.5 rounded-[0.8rem]"><BarChart size={18} className="text-emerald-500 dark:text-emerald-400" /></div>
              <div className="pr-3">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mb-0.5">Completion rate</div>
                <div className="text-[17px] font-black text-slate-900 dark:text-white leading-none">94.2%</div>
              </div>
            </div>
            
            <div className="absolute -right-8 bottom-[18%] bg-white dark:bg-slate-800 rounded-[1.25rem] shadow-xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-700 p-3.5 flex items-center gap-4 transition-colors">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-[0.8rem] border border-blue-100/50 dark:border-blue-800/50"><Star size={18} className="text-[#0066FF] dark:text-blue-400" /></div>
              <div className="pr-3">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mb-0.5">Avg. rating</div>
                <div className="text-[17px] font-black text-slate-900 dark:text-white leading-none">4.9 / 5.0</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is this for Section */}
      <section id="who" className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h3 className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">{t('whoTitlePrefix')}</h3>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">{t('whoTitle')}</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Companies */}
            <div className="bg-blue-600 dark:bg-blue-900 text-white rounded-[1.5rem] p-10 relative overflow-hidden shadow-xl shadow-blue-600/20 dark:shadow-none transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/20">
                <Building size={24} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">{t('whoCompanyTitle')}</h3>
              <p className="text-blue-100 mb-8 leading-relaxed font-medium text-[15px]">
                {t('whoCompanyDesc')}
              </p>
              
              <ul className="space-y-4 mb-10 text-[15px] font-medium text-blue-50">
                <li className="flex items-center gap-3"><Check size={18} className="text-white" /> {t('whoCompanyCheck1')}</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-white" /> {t('whoCompanyCheck2')}</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-white" /> {t('whoCompanyCheck3')}</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-white" /> {t('whoCompanyCheck4')}</li>
              </ul>
              
              <Link href="/entreprises" className="inline-flex bg-white dark:bg-slate-800 text-blue-600 dark:text-white px-6 py-3 rounded-xl font-bold items-center gap-2 hover:bg-blue-50 dark:hover:bg-slate-700 transition">
                {t('whoCompanyBtn')} &rarr;
              </Link>
            </div>

            {/* For Career Switchers */}
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-[1.5rem] p-10 relative overflow-hidden transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 dark:bg-blue-900 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl opacity-40 transition-colors"></div>
              
              <div className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center mb-8 shadow-sm transition-colors">
                <User size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold mb-4">{t('whoCareerTitle')}</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium text-[15px] transition-colors">
                {t('whoCareerDesc')}
              </p>
              
              <ul className="space-y-4 mb-10 text-[15px] font-medium text-slate-600 dark:text-slate-400 transition-colors">
                <li className="flex items-center gap-3"><Check size={18} className="text-blue-600 dark:text-blue-400" /> {t('whoCareerCheck1')}</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-blue-600 dark:text-blue-400" /> {t('whoCareerCheck2')}</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-blue-600 dark:text-blue-400" /> {t('whoCareerCheck3')}</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-blue-600 dark:text-blue-400" /> {t('whoCareerCheck4')}</li>
              </ul>
              
              <Link href="/inscription" className="inline-flex bg-blue-600 text-white px-6 py-3 rounded-xl font-bold items-center gap-2 hover:bg-blue-700 transition shadow-md shadow-blue-600/20">
                {t('whoCareerBtn')} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Preview */}
      <section className="py-24 bg-[#f8fafc] dark:bg-slate-900 transition-colors">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">{t('catalogPrefix')}</h3>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">{t('catalogTitle')}</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium transition-colors">{t('catalogDesc')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {formations.slice(0,3).map((formation: any, index: number) => {
              const theme = cardThemes[index % cardThemes.length];
              const Icon = theme.icon;

              return (
                <div key={formation.id} className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl hover:-translate-y-1 transition duration-300">
                  {/* Image / Header Half */}
                  <div className={`${theme.bg} h-48 relative p-6 flex flex-col justify-between`}>
                    <div className="flex justify-between items-start">
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full border border-white/20 uppercase tracking-wider">
                        FREE
                      </span>
                      {theme.badgeRight && (
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full border border-white/20">
                          {theme.badgeRight}
                        </span>
                      )}
                    </div>
                    <div className="absolute right-6 bottom-6 w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition">
                      <Icon className="text-white" size={24} />
                    </div>
                  </div>
                  
                  {/* Content Half */}
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-[1.1rem] font-bold text-slate-900 dark:text-white group-hover:text-[#0066FF] dark:group-hover:text-blue-400 transition-colors mb-4 leading-tight">
                      {formation.titre}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-[13px] font-bold text-slate-400 dark:text-slate-500 mb-8">
                      <span className="flex items-center gap-1.5"><BarChart size={14} /> {translateLevel(formation.niveau)}</span>
                      <span className="flex items-center gap-1.5"><Play size={14} /> {formation.duree || '6h 30'}</span>
                    </div>
                    
                    <Link href={`/formations/${formation.id}`} className="mt-auto w-full text-center py-3 border border-blue-200 dark:border-slate-600 text-[#0066FF] dark:text-blue-400 group-hover:bg-[#0066FF] group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:border-blue-600 font-bold text-[14px] rounded-2xl transition-colors">
                      {t('catalogEnroll')}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Student Banner */}
      <section className="container mx-auto px-6 pb-24">
        <div className="bg-[#0055FF] rounded-[2rem] p-10 md:p-14 flex flex-col lg:flex-row items-center justify-between text-white shadow-2xl relative overflow-hidden">
          {/* Dotted Pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          
          <div className="max-w-2xl relative z-10 w-full mb-10 lg:mb-0">
            <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-6 bg-white/5 backdrop-blur-sm">
              <Zap size={14} className="fill-white" /> {t('studentOfferBadge')}
            </div>
            
            <h2 className="text-4xl md:text-[2.75rem] font-extrabold mb-4 tracking-tight leading-tight">
              {t('studentOfferTitle1')} <span className="underline decoration-wavy decoration-white/40 underline-offset-8">{t('studentOfferTitle2')}</span> {t('studentOfferTitle3')}
            </h2>
            
            <p className="text-blue-100 text-[15px] font-medium leading-relaxed mb-8 max-w-xl">
              {t('studentOfferDesc')}
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-blue-100">
              <span className="flex items-center gap-2"><Check size={16} className="text-white" /> {t('studentOfferCheck1')}</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-white" /> {t('studentOfferCheck2')}</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-white" /> {t('studentOfferCheck3')}</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-white" /> {t('studentOfferCheck4')}</span>
            </div>
          </div>
          
          <div className="relative z-10 shrink-0 flex flex-col items-center lg:items-end w-full lg:w-auto">
            <Link href="/inscription" className="bg-white text-[#0066FF] pl-8 pr-2 py-2 rounded-full font-bold text-[15px] hover:bg-blue-50 transition shadow-xl flex items-center gap-4 w-full sm:w-auto justify-center">
              {t('studentOfferBtn')}
              <div className="bg-[#0066FF] p-2.5 rounded-full flex items-center justify-center">
                <ArrowRight size={18} className="text-white" />
              </div>
            </Link>
            <div className="mt-4 text-xs font-medium text-blue-200">
              {t('studentOfferLoginHint')} <Link href="/connexion" className="text-white font-bold hover:underline">{t('studentOfferLoginBtn')}</Link>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
    </>
  );
}
