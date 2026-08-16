"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BrainCircuit, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

//  uses useSearchParams
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      setStatus('error');
      return;
    }

    if (!emailParam) {
      setErrorMessage('Invalid reset link');
      setStatus('error');
      return;
    }

    setStatus('loading');
    
    try {
      const res = await fetch('http://localhost:5000/api/mot-de-passe-reset', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailParam, newPassword: formData.newPassword })
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setErrorMessage('Failed to reset password');
        setStatus('error');
      }
    } catch(e) {
      setErrorMessage('Server error');
      setStatus('error');
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
            <BrainCircuit size={16} className="text-blue-600" /> Secure Your Account
          </div>
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight mb-8 text-slate-900">
            Create your <br />
            <span className="text-[#0066FF]">new password</span>
          </h1>
          <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
            Make sure to choose a strong, unique password to keep your HR-Trainer learning space secure.
          </p>
        </div>

      <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden z-10 mx-auto">
        {/* Blue Header Area */}
        <div className="bg-gradient-to-r from-[#0066FF] to-[#00bfff] p-8 sm:px-10">
          <div className="text-blue-100 font-bold text-xs tracking-wider mb-2 uppercase">
            PASSWORD RESET
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">New Password</h1>
          <p className="text-sm text-blue-100 font-medium">Update the password for {emailParam}</p>
        </div>

        <div className="p-8 sm:px-10">
          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Password Updated!</h2>
              <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                Your password has been successfully reset. You can now use it to sign in.
              </p>
              <Link href="/connexion" className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#0066FF] hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                Sign in now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* New Password */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input required value={formData.newPassword} onChange={e => setFormData({...formData, newPassword: e.target.value})} type={showPassword ? "text" : "password"} className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-11 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition placeholder:text-slate-400" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input required value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} type={showPassword ? "text" : "password"} className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition placeholder:text-slate-400" placeholder="••••••••" />
                </div>
              </div>

              {status === 'error' && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-lg">{errorMessage}</p>}

              <button disabled={status === 'loading'} type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#0066FF] hover:bg-blue-700 transition disabled:opacity-70 shadow-lg shadow-blue-500/20 mt-2">
                {status === 'loading' ? 'Updating...' : 'Update Password'} <ArrowRight size={16} />
              </button>
              
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

import { Suspense } from 'react'
export default function ReinitialiserMotDePasse() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
