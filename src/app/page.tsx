import Link from 'next/link';
import { ArrowRight, Check, Play, BookOpen, BarChart, BrainCircuit, Building, User, Zap, Star } from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';

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
  
  // couleurs  cartes
  const cardThemes = [
    { bg: 'bg-[#7E57C2]', icon: BookOpen, badgeRight: 'Popular' },
    { bg: 'bg-[#0088FF]', icon: BarChart, badgeRight: 'New' },
    { bg: 'bg-[#00C48C]', icon: BrainCircuit, badgeRight: null }
  ];

  return (
    <>
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold mb-8">
            <Zap size={16} className="fill-blue-600" /> AI-Powered HR Training
          </div>
          <h1 className="text-5xl md:text-[4.5rem] font-extrabold leading-[1.1] tracking-tight mb-8 text-slate-900">
            HR Training, <br />
            <span className="text-blue-600">Reinvented</span><br />
            by AI
          </h1>
          <p className="text-lg text-slate-500 mb-10 leading-relaxed pr-8 font-medium">
            Personalized learning paths, real-time AI coaching, and adaptive assessments — built for HR teams and career-changers who need results, not just certificates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/formations" className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-600/30">
              Start Learning Free &rarr;
            </Link>
            <Link href="/entreprises" className="bg-white text-slate-900 border border-slate-200 shadow-sm px-8 py-3.5 rounded-xl font-semibold flex items-center justify-center hover:bg-slate-50 transition">
              Request Enterprise Demo
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-400">
            <span className="flex items-center gap-1.5"><Check size={16} className="text-blue-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Check size={16} className="text-blue-500" /> 14-day trial</span>
            <span className="flex items-center gap-1.5"><Check size={16} className="text-blue-500" /> Cancel anytime</span>
          </div>
        </div>

        {/* Hero Right - UI Mockup */}
        <div className="relative hidden lg:block">
          {/* Lueur d'arrière-plan */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 rounded-full blur-3xl -z-10"></div>
          
          {/* Fenêtre de Chat */}
          <div className="bg-white rounded-[1.25rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden w-full max-w-[500px] mx-auto relative z-10">
            {/* Header */}
            <div className="border-b border-slate-100 p-4 pb-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0066FF] rounded-full flex items-center justify-center shadow-sm">
                <BrainCircuit size={20} className="text-white" />
              </div>
              <div>
                <div className="text-[15px] font-bold text-slate-900 leading-tight">HR-Trainer AI Coach</div>
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
            <div className="p-6 space-y-6 bg-[#f8fafc]">
              {/* Message AI 1 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0066FF] flex-shrink-0 flex items-center justify-center mt-1 shadow-sm">
                  <BrainCircuit size={16} className="text-white" />
                </div>
                <div className="bg-white border border-slate-200/70 p-4 rounded-2xl rounded-tl-sm text-[14.5px] text-slate-700 shadow-sm leading-relaxed max-w-[85%]">
                  Welcome back, Sarah! Ready to continue <Link href="#" className="text-[#0066FF] font-bold hover:underline">Employment Law Basics</Link>? You left off at Module 3.
                </div>
              </div>

              {/* Message User */}
              <div className="flex gap-4 justify-end">
                <div className="bg-[#0066FF] text-white px-5 py-3.5 rounded-2xl rounded-tr-sm text-[14.5px] font-bold shadow-md max-w-[80%] leading-relaxed">
                  Yes! Can you quiz me on the GDPR section first?
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center mt-1 text-xs font-bold text-[#0066FF]">
                  S
                </div>
              </div>

              {/* Message AI 2 (Quiz) */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0066FF] flex-shrink-0 flex items-center justify-center mt-1 shadow-sm">
                  <BrainCircuit size={16} className="text-white" />
                </div>
                <div className="bg-white border border-slate-200/70 p-4 rounded-2xl rounded-tl-sm shadow-sm w-full">
                  <p className="text-[14.5px] text-slate-900 mb-4 font-medium">Under GDPR, what is the maximum fine for a Tier 2 violation?</p>
                  <div className="space-y-2.5">
                    <button className="w-full text-left px-4 py-3 rounded-xl border border-slate-200/60 bg-[#eff4fa] text-[14px] text-slate-700 hover:bg-slate-200 font-medium transition shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">€10M or 2% of global turnover</button>
                    <button className="w-full text-left px-4 py-3 rounded-xl border border-slate-200/60 bg-[#eff4fa] text-[14px] text-slate-700 hover:bg-slate-200 font-medium transition shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">€20M or 4% of global turnover</button>
                    <button className="w-full text-left px-4 py-3 rounded-xl border border-slate-200/60 bg-[#eff4fa] text-[14px] text-slate-700 hover:bg-slate-200 font-medium transition shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">€5M or 1% of global turnover</button>
                  </div>
                </div>
              </div>
              
              {/* Message AI 3  */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0066FF] flex-shrink-0 flex items-center justify-center shadow-sm">
                  <BrainCircuit size={16} className="text-white" />
                </div>
                <div className="bg-white border border-slate-200/70 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>

            {/* Input area */}
            <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
              <input type="text" placeholder="Ask HR-Trainer anything..." className="flex-grow bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-[14px] text-slate-700 outline-none focus:border-[#0066FF]" disabled />
              <button className="w-11 h-11 rounded-full bg-[#0066FF] flex items-center justify-center flex-shrink-0 shadow-md">
                <ArrowRight size={18} className="text-white" />
              </button>
            </div>
            
            {/* Floating Badges */}
            <div className="absolute -left-14 top-[35%] bg-white rounded-[1.25rem] shadow-xl shadow-slate-200 border border-slate-100 p-3.5 flex items-center gap-4 transform -translate-y-1/2">
              <div className="bg-emerald-50 p-2.5 rounded-[0.8rem]"><BarChart size={18} className="text-emerald-500" /></div>
              <div className="pr-3">
                <div className="text-[11px] text-slate-500 font-bold mb-0.5">Completion rate</div>
                <div className="text-[17px] font-black text-slate-900 leading-none">94.2%</div>
              </div>
            </div>
            
            <div className="absolute -right-8 bottom-[18%] bg-white rounded-[1.25rem] shadow-xl shadow-slate-200 border border-slate-100 p-3.5 flex items-center gap-4">
              <div className="bg-blue-50 p-2.5 rounded-[0.8rem] border border-blue-100/50"><Star size={18} className="text-[#0066FF]" /></div>
              <div className="pr-3">
                <div className="text-[11px] text-slate-500 font-bold mb-0.5">Avg. rating</div>
                <div className="text-[17px] font-black text-slate-900 leading-none">4.9 / 5.0</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is this for Section */}
      <section id="who" className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h3 className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4">Tailored Paths</h3>
            <h2 className="text-4xl font-extrabold text-slate-900">Who is this for?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Companies */}
            <div className="bg-blue-600 text-white rounded-[1.5rem] p-10 relative overflow-hidden shadow-xl shadow-blue-600/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/20">
                <Building size={24} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">For Companies</h3>
              <p className="text-blue-100 mb-8 leading-relaxed font-medium text-[15px]">
                Upskill your HR department at scale. Deploy role-specific training programs, track compliance in real time, and onboard new hires 3x faster with AI-personalized paths.
              </p>
              
              <ul className="space-y-4 mb-10 text-[15px] font-medium text-blue-50">
                <li className="flex items-center gap-3"><Check size={18} className="text-white" /> Team dashboards & analytics</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-white" /> Custom compliance tracks</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-white" /> SSO & HRIS integrations</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-white" /> Dedicated success manager</li>
              </ul>
              
              <Link href="/entreprises" className="inline-flex bg-white text-blue-600 px-6 py-3 rounded-xl font-bold items-center gap-2 hover:bg-blue-50 transition">
                Request a Demo &rarr;
              </Link>
            </div>

            {/* For Career Switchers */}
            <div className="bg-slate-50 border border-slate-200 text-slate-900 rounded-[1.5rem] p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl opacity-40"></div>
              
              <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-8 shadow-sm">
                <User size={24} className="text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold mb-4">For Career Switchers</h3>
              <p className="text-slate-500 mb-8 leading-relaxed font-medium text-[15px]">
                Breaking into HR from another field? Our AI coach builds a personalized roadmap from zero, adapts to your pace, and prepares you for globally recognized certifications.
              </p>
              
              <ul className="space-y-4 mb-10 text-[15px] font-medium text-slate-600">
                <li className="flex items-center gap-3"><Check size={18} className="text-blue-600" /> Personalized AI learning roadmap</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-blue-600" /> SHRM & CIPD exam prep</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-blue-600" /> Portfolio project guidance</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-blue-600" /> Live career coaching sessions</li>
              </ul>
              
              <Link href="/inscription" className="inline-flex bg-blue-600 text-white px-6 py-3 rounded-xl font-bold items-center gap-2 hover:bg-blue-700 transition shadow-md shadow-blue-600/20">
                Start Free &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Preview */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4">Course Catalog</h3>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Start with what matters</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">All courses are AI-enhanced, continuously updated, and available from day one — at no cost.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {formations.slice(0,3).map((formation: any, index: number) => {
              const theme = cardThemes[index % cardThemes.length];
              const Icon = theme.icon;

              return (
                <div key={formation.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl hover:-translate-y-1 transition duration-300">
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
                    <h3 className="text-[1.1rem] font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors mb-4 leading-tight">
                      {formation.titre}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-[13px] font-bold text-slate-400 mb-8">
                      <span className="flex items-center gap-1.5"><BarChart size={14} /> {translateLevel(formation.niveau)}</span>
                      <span className="flex items-center gap-1.5"><Play size={14} /> {formation.duree || '6h 30'}</span>
                    </div>
                    
                    <Link href={`/formations/${formation.id}`} className="mt-auto w-full text-center py-3 border border-blue-200 text-[#0066FF] group-hover:bg-[#0066FF] group-hover:text-white group-hover:border-[#0066FF] font-bold text-[14px] rounded-2xl transition-colors">
                      Enroll Free
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
              <Zap size={14} className="fill-white" /> LAUNCH OFFER
            </div>
            
            <h2 className="text-4xl md:text-[2.75rem] font-extrabold mb-4 tracking-tight leading-tight">
              Student access <span className="underline decoration-wavy decoration-white/40 underline-offset-8">100% free</span> right now!
            </h2>
            
            <p className="text-blue-100 text-[15px] font-medium leading-relaxed mb-8 max-w-xl">
              Enjoy full access to all our AI-enhanced HR courses — no signup fees, no credit card required. Get your first recognized certifications before the launch offer ends.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-blue-100">
              <span className="flex items-center gap-2"><Check size={16} className="text-white" /> Unlimited course access</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-white" /> AI Coach included</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-white" /> Recognized certificates</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-white" /> No commitment</span>
            </div>
          </div>
          
          <div className="relative z-10 shrink-0 flex flex-col items-center lg:items-end w-full lg:w-auto">
            <Link href="/inscription" className="bg-white text-[#0066FF] pl-8 pr-2 py-2 rounded-full font-bold text-[15px] hover:bg-blue-50 transition shadow-xl flex items-center gap-4 w-full sm:w-auto justify-center">
              Create my free account
              <div className="bg-[#0066FF] p-2.5 rounded-full flex items-center justify-center">
                <ArrowRight size={18} className="text-white" />
              </div>
            </Link>
            <div className="mt-4 text-xs font-medium text-blue-200">
              Already have an account? <Link href="/connexion" className="text-white font-bold hover:underline">Sign in</Link>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
    </>
  );
}
