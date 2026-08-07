"use client";
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { User, Lock, Camera, ShieldAlert, Users, BookOpen, Star } from 'lucide-react';

export default function AdminSettings() {
  const { data: session, status, update } = useSession();
  const [nom, setNom] = useState('');
  const [photo, setPhoto] = useState('');
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, totalFormations: 0 });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.user) {
      setNom(session.user.name || '');
      setPhoto((session.user as any).photo || '');
    }

    if (session?.user?.email) {
      fetch(`http://localhost:5000/api/admin/dashboard?adminEmail=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          setStats({
            totalUsers: data?.totalUsers || 0,
            activeUsers: data?.activeUsers || 0,
            totalFormations: data?.totalFormations || 0
          });
        })
        .catch(err => console.error(err));
    }
  }, [session]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('loading');
    
    try {
      const res = await fetch('http://localhost:5000/api/profil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: (session?.user as any)?.id, 
          nom,
          photo
        })
      });
      
      if (res.ok) {
        setSaveStatus('success');
        await update({ name: nom, photo });
        // Dispatch event for Navbar update
        localStorage.setItem('user_profile_updated', JSON.stringify({ nom, photo }));
        window.dispatchEvent(new Event('profile_updated'));
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch(e) {
      setSaveStatus('error');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'AD';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  if (status === 'loading') {
    return <div className="animate-pulse flex flex-col gap-6 max-w-3xl"><div className="h-64 bg-slate-200 rounded-2xl w-full"></div></div>;
  }

  return (
    <div className="max-w-4xl space-y-6 pb-12">

      {/* Card 1: Header Profile */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
        {/* Blue Top Section */}
        <div className="h-32 bg-gradient-to-r from-[#0066FF] to-[#00bfff] relative">
          <button className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold text-white transition border border-white/20">
            <Camera size={14} /> Edit Banner
          </button>
        </div>
        
        {/* Profile Details (Overlapping) */}
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-start">
            <div className="relative -mt-12 flex items-end">
              <div 
                className="w-24 h-24 bg-[#4A72FF] text-white rounded-2xl flex items-center justify-center text-3xl font-bold border-4 border-white shadow-sm overflow-hidden relative cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {photo ? (
                  <img src={photo} alt="Profile" className="w-full h-full object-cover group-hover:opacity-60 transition" />
                ) : (
                  <span className="group-hover:opacity-20 transition">{getInitials(session?.user?.name || '')}</span>
                )}
                
                {/* Camera Overlay Icon on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/30">
                  <Camera size={24} className="text-white" />
                </div>

                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center translate-x-1/4 translate-y-1/4 z-10">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
            
            <div className="mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#0066FF] rounded-lg text-xs font-bold border border-blue-100">
                <ShieldAlert size={14} /> Super Admin
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h2 className="text-2xl font-extrabold text-slate-900">{session?.user?.name}</h2>
            <p className="text-slate-500 text-sm mt-0.5">{session?.user?.email}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center mt-8 pt-6 border-t border-slate-100 text-center">
            <div className="flex-1">
              <div className="flex items-center justify-center gap-2 text-[#0066FF] mb-1">
                <Users size={18} /> <span className="text-2xl font-black text-slate-900">{stats.totalUsers}</span>
              </div>
              <div className="text-xs text-slate-400 font-medium">Total Users</div>
            </div>
            <div className="w-px h-10 bg-slate-100"></div>
            <div className="flex-1">
              <div className="flex items-center justify-center gap-2 text-emerald-500 mb-1">
                <Star size={18} /> <span className="text-2xl font-black text-slate-900">{stats.activeUsers}</span>
              </div>
              <div className="text-xs text-slate-400 font-medium">Active Users</div>
            </div>
            <div className="w-px h-10 bg-slate-100"></div>
            <div className="flex-1">
              <div className="flex items-center justify-center gap-2 text-purple-500 mb-1">
                <BookOpen size={18} /> <span className="text-2xl font-black text-slate-900">{stats.totalFormations}</span>
              </div>
              <div className="text-xs text-slate-400 font-medium">Courses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Informations personnelles */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
            <User size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Admin Profile Information</h3>
            <p className="text-xs text-slate-400 font-medium">Update your display name and photo</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User size={16} className="text-slate-400" />
                </div>
                <input 
                  required
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-900 font-medium focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition shadow-sm" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <input 
                  disabled
                  value={session?.user?.email || ''}
                  type="email" 
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-500 font-medium cursor-not-allowed" 
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <Lock size={14} className="text-slate-300" />
                </div>
              </div>
              <p className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mt-2">
                <Lock size={10} /> Cannot be changed
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center">
            <button disabled={saveStatus === 'loading'} type="submit" className="bg-[#0066FF] hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition shadow-md disabled:opacity-70">
              {saveStatus === 'loading' ? 'Saving...' : 'Save Changes'}
            </button>
            {saveStatus === 'success' && <span className="ml-4 text-emerald-600 text-sm font-bold">Changes saved!</span>}
            {saveStatus === 'error' && <span className="ml-4 text-red-600 text-sm font-bold">Error while saving.</span>}
          </div>
        </form>
      </div>

    </div>
  );
}
