"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrainCircuit, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Connexion() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('Incorrect credentials. Please try again.');
  const [showPassword, setShowPassword] = useState(false);

  const ALLOWED_DOMAIN = "@entreprise.com"; // Change this to your desired domain

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    
    // Admin bypass or general login shouldn't be strictly blocked by domain if account exists
    // (Domain check is maintained for signups)

    const signInRes = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password
    });

    if (signInRes?.error) {
      setStatus('error');
      setErrorMsg('Incorrect credentials. Please try again.');
    } else {
      router.push('/mon-espace');
      router.refresh();
    }
  };

  return (
    <>
    <Header />
    <main className="min-h-[calc(100vh-140px)] bg-[#f8fafc] py-16 px-6 font-sans">
      <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side - Hero Text */}
        <div className="hidden lg:block max-w-lg">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold mb-8">
            <BrainCircuit size={16} className="text-blue-600" /> Welcome Back
          </div>
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight mb-8 text-slate-900">
            HR Training, <br />
            <span className="text-[#0066FF]">Reinvented</span><br />
            by AI
          </h1>
          <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
            Ready to continue your learning journey? Jump back into your personalized learning paths and real-time AI coaching.
          </p>
        </div>

      <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden z-10 mx-auto">
        {/* Blue Header Area */}
        <div className="bg-gradient-to-r from-[#0066FF] to-[#00bfff] p-8 sm:px-10">
          <div className="text-blue-100 font-bold text-xs tracking-wider mb-2 uppercase">
            WELCOME BACK
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Sign in to HR-Trainer</h1>
          <p className="text-sm text-blue-100 font-medium">Continue your learning journey.</p>
        </div>

        <div className="p-8 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition placeholder:text-slate-400" placeholder="sarah@company.com" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} type={showPassword ? "text" : "password"} className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-11 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition placeholder:text-slate-400" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link href="/mot-de-passe-oublie" className="text-xs font-bold text-slate-500 hover:text-[#0066FF] transition">Forgot password?</Link>
              </div>
            </div>

            {status === 'error' && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-lg">{errorMsg}</p>}

            <button disabled={status === 'loading'} type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#0066FF] hover:bg-blue-700 transition disabled:opacity-70 shadow-lg shadow-blue-500/20">
              {status === 'loading' ? 'Signing in...' : 'Sign in'} <ArrowRight size={16} />
            </button>
            
            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-400">or</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Google Button */}
            <button onClick={() => signIn('google')} type="button" className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm">
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
              Continue with Google
            </button>

            <p className="text-center text-[13px] text-slate-500 font-medium mt-6">
              No account yet? <Link href="/inscription" className="text-[#0066FF] font-bold hover:underline">Sign up free</Link>
            </p>
          </form>
        </div>
      </div>
      </div>
    </main>
    <Footer />
    </>
  );
}
