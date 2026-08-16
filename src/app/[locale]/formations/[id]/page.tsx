import Link from 'next/link';
import { ArrowLeft, Clock, GraduationCap, Users, Star, PlayCircle, Lock, BookOpen, Check, AlertCircle, Award, Sparkles, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnrollButton from './EnrollButton';
import ModuleList from './ModuleList';

async function getFormation(id: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/formations/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch(e) {
    return null;
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

export default async function FormationDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const formation = await getFormation(resolvedParams.id);

  if (!formation) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-sans">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Course not found</h1>
          <Link href="/formations" className="text-[#0066FF] hover:underline font-bold">Return to catalog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isFree = formation.gratuit !== false;
  const levelEn = translateLevel(formation.niveau);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      
      {/* Background Hero Layer */}
      <div className="bg-[#6B4BFF] text-white">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-8 py-16">
              <Link href="/formations" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition mb-8 text-[13px] font-bold">
                <ArrowLeft size={14} /> All courses
              </Link>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-full border border-white/20 uppercase tracking-wider">
                  {levelEn}
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-full border border-white/20 uppercase tracking-wider">
                  Popular
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-full border border-white/20 uppercase tracking-wider">
                  {isFree ? 'Free' : 'Paid'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-3xl leading-tight tracking-tight">
                {formation.titre}
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mb-10 font-medium leading-relaxed">
                {formation.description}
              </p>
              
              <div className="flex flex-wrap gap-6 text-white/90 text-sm font-bold">
                <span className="flex items-center gap-2"><Clock size={16} /> {formation.duree || '6h 30'} of content</span>
                <span className="flex items-center gap-2"><BookOpen size={16} /> {formation.modules?.length || 8} modules</span>
                <span className="flex items-center gap-2"><Users size={16} /> 2,840 learners</span>
                <span className="flex items-center gap-2"><Star size={16} className="fill-white" /> 4.9/5 rating</span>
              </div>
            </div>

            {/* Right Hero Card */}
            <div className="lg:col-span-4 hidden lg:block relative">
              <div className="absolute top-4 w-full bg-white rounded-3xl shadow-xl overflow-hidden text-slate-900 border border-slate-100 flex flex-col">
                <div 
                  className={`h-32 ${formation.imageUrl ? 'bg-cover bg-center' : 'bg-slate-100'} flex items-center justify-center relative`}
                  style={formation.imageUrl ? { backgroundImage: `url(${formation.imageUrl})` } : {}}
                >
                  {formation.imageUrl && <div className="absolute inset-0 bg-black/20"></div>}
                  {/* Video Placeholder */}
                  <div className="relative z-10 w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition">
                    <PlayCircle size={28} className="text-[#0066FF] ml-1" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-end mb-4">
                    <h2 className="text-[28px] font-extrabold">{isFree ? 'Free' : 'Paid'}</h2>
                    <span className="text-[13px] font-bold text-slate-400">Full access</span>
                  </div>
                  <EnrollButton isFree={isFree} />
                  
                  <div className="mt-5 space-y-2.5">
                    <div className="flex gap-3 items-center text-[13px] font-bold text-slate-500">
                      <Check size={16} className="text-[#0066FF]" /> Lifetime access
                    </div>
                    <div className="flex gap-3 items-center text-[13px] font-bold text-slate-500">
                      <Check size={16} className="text-[#0066FF]" /> AI Coach included
                    </div>
                    <div className="flex gap-3 items-center text-[13px] font-bold text-slate-500">
                      <Check size={16} className="text-[#0066FF]" /> Recognized certificate
                    </div>
                    <div className="flex gap-3 items-center text-[13px] font-bold text-slate-500">
                      <Check size={16} className="text-[#0066FF]" /> English & French subtitles
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto max-w-6xl px-6 pb-24">
        <div className="grid lg:grid-cols-12 gap-12 relative">
          
          {/* Left Column (Content) */}
          <div className="lg:col-span-8 space-y-12 py-12">
            
            {/* About */}
            <div>
              <h2 className="text-[22px] font-extrabold text-slate-900 mb-4">About this course</h2>
              <p className="text-slate-500 leading-relaxed font-medium text-[15px]">
                {formation.description} This course covers all the essential foundations required for HR professionals. Designed with interactive AI simulations and adaptive quizzes for lasting knowledge retention.
              </p>
            </div>

            {/* What you'll learn */}
            <div>
              <h2 className="text-[22px] font-extrabold text-slate-900 mb-6">What you'll learn</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {formation.modules?.slice(0, 6).map((m: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200">
                    <TrendingUp size={16} className="text-[#0066FF] flex-shrink-0" />
                    <span className="text-[14px] font-bold text-slate-700 line-clamp-1">{m.titre}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-[22px] font-extrabold text-slate-900">Course Curriculum</h2>
                <span className="text-[13px] font-bold text-slate-400">{formation.modules?.length || 8} modules • {formation.duree || '6h 30'}</span>
              </div>
              
              <ModuleList modules={formation.modules || Array(8).fill({ titre: "Sample Module" })} formationId={formation.id} />
            </div>

            {/* Alert */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4 items-start">
              <Lock size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[13px] font-medium text-amber-800 leading-relaxed">
                <strong className="font-bold">Content reserved for enrolled students.</strong> Only the first module is freely accessible. Create a free account to unlock the entire course.
              </p>
            </div>

            {/* Certificate */}
            <div className="bg-[#f0f5ff] border border-blue-100 rounded-3xl p-6 flex gap-6 items-start">
              <div className="bg-[#0066FF] p-4 rounded-2xl shadow-md">
                <Award size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-slate-900 mb-1">Certificate of completion</h3>
                <p className="text-[14px] font-medium text-slate-600 leading-relaxed">
                  Upon completion of the course, obtain a shareable digital certificate for LinkedIn, recognized by HR employers.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column (Sticky Sidebar) */}
          <div className="lg:col-span-4 relative mt-12">
            <div className="sticky top-28 bg-white rounded-3xl shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-slate-100 overflow-hidden flex flex-col mb-12 lg:mb-0">
              
              {/* Card Header Image Placeholder */}
              <div 
                className={`h-32 ${formation.imageUrl ? 'bg-cover bg-center' : 'bg-[#6B4BFF]'} relative flex items-center justify-center`}
                style={formation.imageUrl ? { backgroundImage: `url(${formation.imageUrl})` } : {}}
              >
                {formation.imageUrl && <div className="absolute inset-0 bg-black/20"></div>}
                <div className="relative z-10 w-16 h-16 border-2 border-white/20 rounded-2xl flex items-center justify-center">
                  <BookOpen size={32} className={formation.imageUrl ? 'text-white' : 'text-white/60'} />
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-[24px] font-extrabold text-slate-900">{isFree ? 'Free' : 'Paid'}</h2>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {levelEn}
                  </span>
                </div>
                
                <EnrollButton isFree={isFree} />

                <div className="mt-5 space-y-3">
                  <div className="flex gap-3 items-center text-[13px] font-bold text-slate-500">
                    <Clock size={16} className="text-[#0066FF]" /> {formation.duree || '6h 30'} of content
                  </div>
                  <div className="flex gap-3 items-center text-[13px] font-bold text-slate-500">
                    <BookOpen size={16} className="text-[#0066FF]" /> {formation.modules?.length || 8} modules
                  </div>
                  <div className="flex gap-3 items-center text-[13px] font-bold text-slate-500">
                    <Users size={16} className="text-[#0066FF]" /> 2,840 learners
                  </div>
                  <div className="flex gap-3 items-center text-[13px] font-bold text-slate-500">
                    <Award size={16} className="text-[#0066FF]" /> Certificate included
                  </div>
                  <div className="flex gap-3 items-center text-[13px] font-bold text-slate-500">
                    <Star size={16} className="text-[#0066FF]" /> Rating 4.9/5
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
