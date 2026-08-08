"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building, User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

export default function Inscription() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nom: '', email: '', password: '', profil: 'PARTICULIER' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const ALLOWED_DOMAIN = "@entreprise.com"; // Change this to your desired domain

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
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-red-500', 'bg-yellow-400', 'bg-[#0066FF]', 'bg-emerald-500'];
  const strengthTextColors = ['', 'text-slate-400', 'text-slate-400', 'text-slate-400', 'text-slate-400']; // In the screenshot, the text color is always grey

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    
    if (!formData.profil) {
      setStatus('error');
      setErrorMsg("Please choose a profile");
      return;
    }

    // Domain restriction removed for testing purposes
    
    try {
      const res = await fetch('http://localhost:5000/api/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error || "An error occurred");
        return;
      }

      const signInRes = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });

      if (signInRes?.error) {
        setStatus('error');
        setErrorMsg("Account created but automatic login failed.");
      } else {
        setStatus('success');
        router.push('/mon-espace');
      }

    } catch(e) {
      setStatus('error');
      setErrorMsg("Failed to connect to the server.");
    }
  };

  return (
    <>
    <Header />
    <main className="min-h-[calc(100vh-140px)] bg-[#f8fafc] py-16 px-6 font-sans">
      <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side - Hero Text */}
        <div className="hidden lg:block max-w-lg">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0066FF] px-4 py-1.5 rounded-full text-sm font-bold mb-8">
            <ShieldCheck size={16} /> Secure Registration
          </div>
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight mb-8 text-slate-900">
            HR Training, <br />
            <span className="text-[#0066FF]">Reinvented</span><br />
            by AI
          </h1>
          <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
            Join thousands of professionals upskilling with personalized learning paths, real-time AI coaching, and adaptive assessments.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-400">
            <span className="flex items-center gap-1.5"><Check size={16} className="text-[#0066FF]" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Check size={16} className="text-[#0066FF]" /> 14-day trial</span>
            <span className="flex items-center gap-1.5"><Check size={16} className="text-[#0066FF]" /> Cancel anytime</span>
          </div>
        </div>

        {/* Right Side - Form Card */}
        <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10 mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-1.5 text-[#0066FF] font-bold text-xs tracking-wider mb-2 uppercase">
              <ShieldCheck size={16} /> CREATE AN ACCOUNT
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Start your HR journey</h2>
            <p className="text-sm text-slate-500 font-medium">Join thousands of HR professionals who are training with AI.</p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">I am...</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={() => setFormData({...formData, profil: 'PARTICULIER'})}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition ${formData.profil === 'PARTICULIER' ? 'border-[#0066FF] bg-white text-slate-900 shadow-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
              >
                <div className={`p-2 rounded-full ${formData.profil === 'PARTICULIER' ? 'bg-blue-50 text-[#0066FF]' : 'bg-slate-100 text-slate-400'}`}>
                  <User size={20} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm">Individual</div>
                  <div className="text-[11px] font-medium text-slate-400 mt-0.5">Career switcher</div>
                </div>
              </button>
              
              <button 
                type="button"
                onClick={() => setFormData({...formData, profil: 'ENTREPRISE'})}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition ${formData.profil === 'ENTREPRISE' ? 'border-[#0066FF] bg-white text-slate-900 shadow-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
              >
                <div className={`p-2 rounded-full ${formData.profil === 'ENTREPRISE' ? 'bg-blue-50 text-[#0066FF]' : 'bg-slate-100 text-slate-400'}`}>
                  <Building size={20} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm">Company</div>
                  <div className="text-[11px] font-medium text-slate-400 mt-0.5">HR team training</div>
                </div>
              </button>
            </div>
            {!formData.profil && <p className="text-red-500 text-xs mt-2">Please choose a profile</p>}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-slate-400" />
              </div>
              <input required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} type="text" className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition placeholder:text-slate-400" placeholder="Sarah Johnson" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Professional Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-400" />
              </div>
              <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition placeholder:text-slate-400" placeholder={`sarah${ALLOWED_DOMAIN}`} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input required minLength={8} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} type={showPassword ? "text" : "password"} className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-11 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition placeholder:text-slate-400" placeholder="Min. 8 characters" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Password Strength Meter */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(level => (
                    <div key={level} className={`h-1 w-full rounded-full transition-colors ${strength >= level ? strengthColors[strength] : 'bg-slate-200'}`} />
                  ))}
                </div>
                <div className={`text-[11px] font-medium mt-1.5 ${strengthTextColors[strength]}`}>
                  {strengthLabels[strength]}
                </div>
              </div>
            )}
          </div>

          {status === 'error' && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-lg">{errorMsg}</p>}

          <button disabled={status === 'loading'} type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#0066FF] hover:bg-blue-700 transition disabled:opacity-70 shadow-sm mt-4">
            {status === 'loading' ? 'Creating account...' : 'Create my account'} <ArrowRight size={16} />
          </button>
          
          <div className="text-center mt-6">
            <p className="text-[12px] text-slate-500 font-medium mb-4">
              By creating an account, you agree to our <Link href="#" className="text-[#0066FF] hover:underline">Terms</Link> and our <Link href="#" className="text-[#0066FF] hover:underline">Privacy Policy</Link>.
            </p>
            <p className="text-[14px] text-slate-500 font-medium">
              Already have an account? <Link href="/connexion" className="text-[#0066FF] font-bold hover:underline">Log in</Link>
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
