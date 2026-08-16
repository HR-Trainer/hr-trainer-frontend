'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function EnrollButton({ isFree }: { isFree: boolean }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleEnroll = () => {
    if (session) {
      router.push('/mon-espace');
    } else {
      router.push('/inscription');
    }
  };

  return (
    <div className="w-full">
      <button 
        onClick={handleEnroll}
        className="w-full bg-[#0066FF] text-white font-bold text-[15px] py-3.5 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-md"
      >
        {isFree ? 'Enroll for free' : 'Enroll now'} <ArrowRight size={18} />
      </button>
      {!session && (
        <p className="text-center text-[12px] font-bold text-slate-400 mt-4">
          Already enrolled? <button onClick={() => router.push('/connexion')} className="text-[#0066FF] hover:underline">Sign in</button>
        </p>
      )}
    </div>
  );
}
