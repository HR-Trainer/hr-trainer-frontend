"use client";
import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useRouter } from 'next/navigation';
import { Building, User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function Inscription() {
  const router = useRouter();
  const t = useTranslations('Register');
  const [formData, setFormData] = useState({ nom: '', email: '', password: '', profil: 'PARTICULIER' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length > 5) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;
    return Math.min(4, Math.max(1, score));
  };

  const strength = getPasswordStrength(formData.password);
  const strengthLabels = ['', t('strengthWeak'), t('strengthFair'), t('strengthGood'), t('strengthStrong')];
  const strengthColors = ['', 'bg-red-500', 'bg-yellow-400', 'bg-[#0066FF]', 'bg-emerald-500'];
  const strengthTextColors = ['', 'text-slate-400', 'text-slate-400', 'text-slate-400', 'text-slate-400'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    
    if (!formData.profil) {
      setStatus('error');
      setErrorMsg(t('profileError'));
      return;
    }
    
    try {
      const res = await fetch('http://localhost:5000/api/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error || t('errorMsg'));
        return;
      }

      const signInRes = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });

      if (signInRes?.error) {
        setStatus('error');
        setErrorMsg(t('errorAutoLogin'));
      } else {
        setStatus('success');
        router.push('/mon-espace');
      }

    } catch(e) {
      setStatus('error');
      setErrorMsg(t('errorConnect'));
    }
  };

  return (
    <>
    <Header />
    <main className="min-h-[calc(100vh-140px)] bg-[#f8fafc] dark:bg-slate-900 py-16 px-6 font-sans transition-colors">
      <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side - Hero Text */}
        <div className="hidden lg:block max-w-lg">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-slate-800 text-[#0066FF] dark:text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold mb-8 transition-colors">
            <ShieldCheck size={16} /> {t('secureBadge')}
          </div>
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight mb-8 text-slate-900 dark:text-white transition-colors">
            {t('heroTitle1')} <br />
            <span className="text-[#0066FF] dark:text-blue-400">{t('heroTitle2')}</span><br />
            {t('heroTitle3')}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium transition-colors">
            {t('heroDesc')}
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5"><Check size={16} className="text-[#0066FF] dark:text-blue-400" /> {t('heroCheck1')}</span>
            <span className="flex items-center gap-1.5"><Check size={16} className="text-[#0066FF] dark:text-blue-400" /> {t('heroCheck2')}</span>
            <span className="flex items-center gap-1.5"><Check size={16} className="text-[#0066FF] dark:text-blue-400" /> {t('heroCheck3')}</span>
          </div>
        </div>

        {/* Right Side - Form Card */}
        <div className="w-full max-w-[480px] bg-white dark:bg-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden z-10 mx-auto transition-colors p-8 sm:p-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-1.5 text-[#0066FF] dark:text-blue-400 font-bold text-xs tracking-wider mb-2 uppercase">
              <ShieldCheck size={14} /> {t('formHeaderBadge')}
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{t('formTitle')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('formSubtitle')}</p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">{t('profileLabel')}</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={() => setFormData({...formData, profil: 'PARTICULIER'})}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition ${formData.profil === 'PARTICULIER' ? 'border-[#0066FF] bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-600'}`}
              >
                <div className={`p-2 rounded-full ${formData.profil === 'PARTICULIER' ? 'bg-blue-50 dark:bg-slate-800 text-[#0066FF] dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                  <User size={20} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm">{t('profileIndividual')}</div>
                  <div className="text-[11px] font-medium text-slate-400 mt-0.5">{t('profileIndividualDesc')}</div>
                </div>
              </button>
              
              <button 
                type="button"
                onClick={() => setFormData({...formData, profil: 'ENTREPRISE'})}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition ${formData.profil === 'ENTREPRISE' ? 'border-[#0066FF] bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-600'}`}
              >
                <div className={`p-2 rounded-full ${formData.profil === 'ENTREPRISE' ? 'bg-blue-50 dark:bg-slate-800 text-[#0066FF] dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                  <Building size={20} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm">{t('profileCompany')}</div>
                  <div className="text-[11px] font-medium text-slate-400 mt-0.5">{t('profileCompanyDesc')}</div>
                </div>
              </button>
            </div>
            {!formData.profil && <p className="text-red-500 dark:text-red-400 text-xs mt-2">{t('profileError')}</p>}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">{t('nameLabel')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-slate-400" />
              </div>
              <input required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} type="text" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition placeholder:text-slate-400" placeholder={t('namePlaceholder')} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">{t('emailLabel')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-400" />
              </div>
              <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition placeholder:text-slate-400" placeholder={t('emailPlaceholder')} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">{t('passwordLabel')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input required minLength={8} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} type={showPassword ? "text" : "password"} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-11 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition placeholder:text-slate-400" placeholder={t('passwordPlaceholder')} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Password Strength Meter */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(level => (
                    <div key={level} className={`h-1 w-full rounded-full transition-colors ${strength >= level ? strengthColors[strength] : 'bg-slate-200 dark:bg-slate-700'}`} />
                  ))}
                </div>
                <div className={`text-[11px] font-medium mt-1.5 ${strengthTextColors[strength]}`}>
                  {strengthLabels[strength]}
                </div>
              </div>
            )}
          </div>

          {status === 'error' && <p className="text-red-500 text-sm font-bold text-center bg-red-50 dark:bg-red-900/30 p-3 rounded-lg">{errorMsg}</p>}

          <button disabled={status === 'loading'} type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#0066FF] hover:bg-blue-700 transition disabled:opacity-70 shadow-sm mt-4">
            {status === 'loading' ? t('submitBtnLoading') : t('submitBtn')} <ArrowRight size={16} />
          </button>
          
          <div className="text-center mt-6">
            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mb-4">
              {t('termsText1')} <Link href="#" className="text-[#0066FF] dark:text-blue-400 hover:underline">{t('termsLink')}</Link> {t('termsText2')} <Link href="#" className="text-[#0066FF] dark:text-blue-400 hover:underline">{t('privacyLink')}</Link>.
            </p>
            <p className="text-[14px] text-slate-500 dark:text-slate-400 font-medium">
              {t('hasAccount')} <Link href="/connexion" className="text-[#0066FF] dark:text-blue-400 font-bold hover:underline">{t('login')}</Link>
            </p>
          </div>
        </form>
      </div>
      </div>
    </main>
    <Footer />
    </>
  );
}
