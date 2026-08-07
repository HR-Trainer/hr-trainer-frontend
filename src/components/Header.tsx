'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Zap, BrainCircuit, X } from 'lucide-react';

export default function Header() {
  const [showBanner, setShowBanner] = useState(true);
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 z-50 w-full flex flex-col">
      {/* Top Banner */}
      {showBanner && (
        <div className="bg-[#0066FF] text-white text-center py-2.5 text-sm font-bold flex justify-center items-center gap-2 relative">
          <Zap size={16} className="fill-white" /> 
          Student access 100% free right now — 
          <Link href="/inscription" className="underline underline-offset-2 hover:text-blue-100">Create my account &rarr;</Link>
          <button 
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-75"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Navbar */}
      <nav className="border-b border-slate-100 bg-white">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold flex items-center gap-2 text-slate-900 hover:opacity-90 transition">
            <div className="bg-[#0066FF] p-1.5 rounded-lg">
              <BrainCircuit size={20} className="text-white" />
            </div>
            HR-Trainer
          </Link>
          
          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8 text-[14px] font-bold text-slate-500">
            <Link href="/formations" className="hover:text-slate-900 transition">Courses</Link>
            <Link href="/entreprises" className="hover:text-slate-900 transition">Enterprises</Link>
            <Link href="/a-propos" className="hover:text-slate-900 transition">About</Link>
            <Link href="/contact" className="hover:text-slate-900 transition">Contact</Link>
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {session ? (
              <Link href="/mon-espace" className="bg-[#0066FF] text-white px-5 py-2.5 rounded-full text-[14px] font-bold hover:bg-blue-700 transition shadow-sm">
                My Space
              </Link>
            ) : (
              <>
                <Link href="/connexion" className="text-[14px] font-bold text-slate-500 hover:text-slate-900 transition hidden sm:block">
                  Sign in
                </Link>
                <Link href="/inscription" className="bg-[#0066FF] text-white px-5 py-2.5 rounded-full text-[14px] font-bold hover:bg-blue-700 transition shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
