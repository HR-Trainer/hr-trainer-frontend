import { Link } from '@/i18n/routing';
import { Lightbulb, Heart, Shield, TrendingUp, Info } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations('About');
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Story Section */}
        <section className="bg-slate-50 py-20 px-6">
          <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-[#0066FF] font-extrabold text-[11px] tracking-widest uppercase mb-4">{t('storyBadge')}</div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                {t('storyTitle1')} <br/><span className="text-[#0066FF]">{t('storyTitle2')}</span>
              </h1>
              <div className="text-slate-500 font-medium text-[15px] leading-relaxed space-y-4">
                <p>
                  {t('storyP1')}
                </p>
                <p>
                  {t('storyP2')}
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/20 to-transparent blur-3xl -z-10 rounded-full transform translate-y-10 scale-90"></div>
              <div className="bg-white rounded-3xl shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-slate-100 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#0066FF] text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
                    F
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-[15px]">{t('founderTitle')}</h3>
                    <p className="text-slate-400 text-[12px] font-bold">{t('founderRole')}</p>
                    <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]"></span> Tunis, Tunisia
                    </p>
                  </div>
                </div>
                <p className="italic text-slate-600 font-medium text-[14px] leading-relaxed mb-6">
                  "{t('founderQuote')}"
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-3 items-start">
                  <Info size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-amber-700">
                    {t('founderNote')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="text-[#0066FF] font-extrabold text-[11px] tracking-widest uppercase mb-4">{t('missionBadge')}</div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">{t('missionTitle')}</h2>
              <p className="text-slate-500 font-medium text-[15px]">
                {t('missionDesc')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Value 1 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mb-6">
                  <Lightbulb size={24} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-[17px] mb-3">{t('val1Title')}</h3>
                <p className="text-slate-500 text-[14px] font-medium leading-relaxed">
                  {t('val1Desc')}
                </p>
              </div>
              
              {/* Value 2 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mb-6">
                  <Heart size={24} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-[17px] mb-3">{t('val2Title')}</h3>
                <p className="text-slate-500 text-[14px] font-medium leading-relaxed">
                  {t('val2Desc')}
                </p>
              </div>
              
              {/* Value 3 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mb-6">
                  <Shield size={24} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-[17px] mb-3">{t('val3Title')}</h3>
                <p className="text-slate-500 text-[14px] font-medium leading-relaxed">
                  {t('val3Desc')}
                </p>
              </div>
              
              {/* Value 4 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp size={24} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-[17px] mb-3">{t('val4Title')}</h3>
                <p className="text-slate-500 text-[14px] font-medium leading-relaxed">
                  {t('val4Desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="bg-[#0066FF] py-16 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-4xl font-extrabold mb-2">5,150+</div>
                <div className="text-[12px] font-bold text-blue-100 uppercase tracking-wider">{t('stat1')}</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold mb-2">3</div>
                <div className="text-[12px] font-bold text-blue-100 uppercase tracking-wider">{t('stat2')}</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold mb-2">94%</div>
                <div className="text-[12px] font-bold text-blue-100 uppercase tracking-wider">{t('stat3')}</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold mb-2">2024</div>
                <div className="text-[12px] font-bold text-blue-100 uppercase tracking-wider">{t('stat4')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="text-[#0066FF] font-extrabold text-[11px] tracking-widest uppercase mb-4">{t('teamBadge')}</div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-12 tracking-tight">{t('teamTitle')}</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Member 1 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center hover:shadow-lg transition">
                <div className="w-16 h-16 bg-[#0066FF] text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-4 shadow-md">
                  F
                </div>
                <h3 className="font-extrabold text-slate-900 text-[16px]">{t('teamMember1')}</h3>
                <p className="text-slate-400 text-[12px] font-bold mt-1">{t('teamRole1')}</p>
              </div>
              
              {/* Member 2 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center hover:shadow-lg transition">
                <div className="w-16 h-16 bg-slate-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-4 shadow-md">
                  ?
                </div>
                <h3 className="font-extrabold text-slate-900 text-[16px]">{t('teamMember2')}</h3>
                <p className="text-slate-400 text-[12px] font-bold mt-1">{t('teamRole2')}</p>
              </div>
              
              {/* Member 3 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center hover:shadow-lg transition">
                <div className="w-16 h-16 bg-slate-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-4 shadow-md">
                  ?
                </div>
                <h3 className="font-extrabold text-slate-900 text-[16px]">{t('teamMember3')}</h3>
                <p className="text-slate-400 text-[12px] font-bold mt-1">{t('teamRole3')}</p>
              </div>
            </div>

            <div className="inline-flex max-w-xl mx-auto bg-amber-50 border border-amber-200 rounded-xl p-3 items-center gap-3 text-left">
              <Info size={16} className="text-amber-500 flex-shrink-0" />
              <p className="text-[12px] font-bold text-amber-700">
                {t('teamNote')}
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">{t('ctaTitle')}</h2>
            <p className="text-slate-500 font-medium text-[15px] mb-10">
              {t('ctaDesc')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/inscription" className="bg-[#0066FF] text-white font-bold text-[14px] px-8 py-3.5 rounded-xl hover:bg-blue-700 transition shadow-md inline-flex items-center justify-center gap-2">
                {t('ctaBtn1')} <TrendingUp size={16} />
              </Link>
              <Link href="/contact" className="bg-white text-slate-700 border border-slate-200 font-bold text-[14px] px-8 py-3.5 rounded-xl hover:bg-slate-50 transition inline-flex items-center justify-center">
                {t('ctaBtn2')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
