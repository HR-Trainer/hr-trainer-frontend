"use client";
import { useState } from 'react';
import Link from 'next/link';
import { BrainCircuit, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MotDePasseOublie() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('An error occurred. Please try again.');

  const ALLOWED_DOMAIN = "@entreprise.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    
    if (!email.endsWith(ALLOWED_DOMAIN)) {
      setStatus('error');
      setErrorMsg(`Email address must end with ${ALLOWED_DOMAIN}`);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/mot-de-passe-oublie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg('An error occurred. Please try again.');
      }
    } catch(e) {
      setStatus('error');
      setErrorMsg('An error occurred. Please try again.');
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
            <BrainCircuit size={16} className="text-blue-600" /> Account Recovery
          </div>
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight mb-8 text-slate-900">
            Lost your key? <br />
            <span className="text-[#0066FF]">We've got you</span><br />
            covered.
          </h1>
          <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
            Don't worry, it happens to the best of us. Enter your email and we'll send you a link to get back into your account securely.
          </p>
        </div>

      <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden z-10 mx-auto">
        {/* Blue Header Area */}
        <div className="bg-gradient-to-r from-[#0066FF] to-[#00bfff] p-8 sm:px-10">
          <div className="text-blue-100 font-bold text-xs tracking-wider mb-2 uppercase">
            PASSWORD RESET
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Forgot Password</h1>
          <p className="text-sm text-blue-100 font-medium">Enter your email to reset it.</p>
        </div>

        <div className="p-8 sm:px-10">
          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Check your inbox</h2>
              <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                We've sent a password reset link to <br/>
                <span className="font-bold text-slate-700">{email}</span>
              </p>
              <Link href="/connexion" className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#0066FF] hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                Back to Sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-slate-400" />
                  </div>
                  <input required value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition placeholder:text-slate-400" placeholder="" />
                </div>
              </div>

              {status === 'error' && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-lg">{errorMsg}</p>}

              <button disabled={status === 'loading'} type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#0066FF] hover:bg-blue-700 transition disabled:opacity-70 shadow-lg shadow-blue-500/20 mt-2">
                {status === 'loading' ? 'Sending link...' : 'Send reset link'} <ArrowRight size={16} />
              </button>
              
              <div className="text-center pt-2">
                <Link href="/connexion" className="text-[13px] font-bold text-slate-500 hover:text-[#0066FF] transition">
                  Wait, I remember my password
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
      </div>
    </main>
    <Footer />
    </>
  );
}
