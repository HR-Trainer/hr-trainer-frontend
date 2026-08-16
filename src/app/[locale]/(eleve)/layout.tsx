"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, BookOpen, User, Shield, Bell, 
  Search, LogOut, ChevronRight, GraduationCap, Building, Mail
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';

import { useTranslations } from 'next-intl';

export default function EleveLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Dashboard');
  const [stats, setStats] = useState({ formations: 0, notifications: 0, globalProgress: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [userProfile, setUserProfile] = useState<{nom: string, photo: string | null} | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion');
    } else if (status === 'authenticated' && (session?.user as any)?.role === 'ADMIN') {
      router.push('/admin/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    // Fetch stats
    if (session?.user?.email) {
      fetch(`http://localhost:5000/api/eleve/dashboard?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          let globalProgress = 0;
          if (data?.inscriptions?.length) {
            globalProgress = Math.round(data.inscriptions.reduce((acc: number, cur: any) => acc + (cur.progression || 0), 0) / data.inscriptions.length);
          }
          setStats(prev => ({ 
            ...prev, 
            formations: data?.inscriptions?.length || 0,
            globalProgress: globalProgress
          }));
        })
        .catch(console.error);

      // Fetch notifications
      fetch(`http://localhost:5000/api/notifications?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => setNotifications(data))
        .catch(console.error);
    }
  }, [session, pathname]);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      if (session?.user?.email) {
        const stored = localStorage.getItem(`user_profile_${session.user.email}`);
        if (stored) {
          setUserProfile(JSON.parse(stored));
        }
      }
    };
    window.addEventListener('profile_updated', handleProfileUpdate);
    handleProfileUpdate();
    return () => window.removeEventListener('profile_updated', handleProfileUpdate);
  }, [session]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">Chargement...</div>;
  }

  if (!session) {
    return null;
  }

  const getInitials = (name: string) => {
    if (!name) return 'SM';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const navLinksEspace = [
    { href: '/mon-espace', label: t('navDashboard', { fallback: 'Dashboard' }), icon: LayoutDashboard },
    { href: '/mes-formations', label: t('navCourses', { fallback: 'My Courses' }), icon: BookOpen, badge: stats.formations },
    { href: '/profil', label: t('navProfile', { fallback: 'My Profile' }), icon: User },
    { href: '/securite', label: t('navSecurity', { fallback: 'Security' }), icon: Shield },
    { href: '/notifications', label: t('navNotifications', { fallback: 'Notifications' }), icon: Bell, badge: stats.notifications },
  ];

  const navLinksGlobal = [
    { href: '/formations', label: t('navCatalog', { fallback: 'Course Catalog' }), icon: GraduationCap },
    { href: '/entreprises', label: t('navEnterprise', { fallback: 'Enterprise' }), icon: Building },
    { href: '/contact', label: t('navContact', { fallback: 'Contact' }), icon: Mail },
  ];

  const getPageTitle = () => {
    if (pathname === '/mon-espace') return t('navDashboard', { fallback: 'Dashboard' });
    if (pathname === '/mes-formations') return t('navCourses', { fallback: 'My Courses' });
    if (pathname === '/profil') return t('navProfile', { fallback: 'My Profile' });
    if (pathname === '/securite') return t('navSecurity', { fallback: 'Security' });
    if (pathname === '/notifications') return t('navNotifications', { fallback: 'Notifications' });
    if (pathname === '/attestations') return t('navCertificates', { fallback: 'Certificates' });
    if (pathname?.includes('/modules/')) return t('navCurrentModule', { fallback: 'Current Module' });
    return t('learnerSpace', { fallback: 'Learner Space' });
  };

  return (
    <div className="h-screen bg-[#f8fafc] dark:bg-[#030712] flex overflow-hidden font-sans transition-colors">
      
      {/* Sidebar */}
      <aside className="w-[280px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex flex-shrink-0 transition-colors">
        
        {/* Logo */}
        <div className="h-[72px] px-6 flex items-center border-b border-slate-100 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0066FF] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-lg">H</span>
            </div>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white dark:text-white tracking-tight">
              HR-<span className="text-[#0066FF] dark:text-blue-400">Trainer</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          {/* User Card */}
          <div className="p-5">
            <div className="bg-[#0066FF] rounded-2xl p-4 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="flex gap-3 items-center mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold border border-white/20">
                  {userProfile?.photo || (session?.user as any)?.photo ? (
                    <img src={userProfile?.photo || (session.user as any).photo} alt="avatar" className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    getInitials(userProfile?.nom || session?.user?.name || '')
                  )}
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-sm truncate">{userProfile?.nom || session?.user?.name}</div>
                  <div className="text-[10px] text-blue-200 truncate">{session?.user?.email}</div>
                </div>
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-center text-[10px] font-bold text-blue-100 mb-1.5">
                  <span>Overall Progress</span>
                  <span>{stats.globalProgress} %</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${stats.globalProgress}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-3 flex-1">
            {/* ESPACE APPRENANT */}
            <div className="mb-6">
              <h4 className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">LEARNER SPACE</h4>
              <nav className="space-y-1">
                {navLinksEspace.map(link => {
                  const isActive = pathname === link.href || (link.href !== '/mon-espace' && pathname?.startsWith(link.href));
                  return (
                    <Link key={link.href} href={link.href} className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition ${isActive ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/20' : 'text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:bg-[#1f2937] hover:text-slate-900 dark:text-white'}`}>
                      <div className="flex items-center gap-3">
                        <link.icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                        {link.label}
                      </div>
                      {link.badge !== undefined && link.badge > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-white dark:bg-[#111827] text-[#0066FF]' : 'bg-slate-100 text-slate-500 dark:text-gray-400'}`}>
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* NAVIGATION */}
            <div className="mb-6">
              <h4 className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">NAVIGATION</h4>
              <nav className="space-y-1">
                {navLinksGlobal.map(link => (
                  <Link key={link.href} href={link.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:bg-[#1f2937] hover:text-slate-900 dark:text-white transition">
                    <link.icon size={18} className="text-slate-400" />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          
          <div className="p-3 border-t border-slate-100 dark:border-gray-800">
            <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-500 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 transition">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Header */}
        <header className="h-[72px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 md:px-8 flex-shrink-0 z-10 transition-colors">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400 font-medium hidden sm:inline">Learner Space</span>
            <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 hidden sm:inline" />
            <span className="font-bold text-slate-900 dark:text-white">{getPageTitle()}</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..." 
                className="w-64 pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition placeholder:text-slate-400" 
              />
            </form>
            
            <div className="flex items-center gap-2 border-r border-slate-200 dark:border-gray-700 dark:border-gray-700 pr-4 mr-1">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 text-slate-400 hover:text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:bg-[#1f2937] rounded-full transition"
              >
                <Bell size={20} />
                {notifications.filter(n => !n.lu).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                    <span className="text-xs font-bold bg-[#0066FF]/10 text-[#0066FF] px-2 py-1 rounded-md">{notifications.filter(n => !n.lu).length} new</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-sm">No notifications yet.</div>
                    ) : (
                      notifications.slice(0,5).map(notif => (
                        <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 dark:bg-[#1f2937] transition cursor-pointer ${!notif.lu ? 'bg-blue-50/50' : ''}`}>
                          <h4 className={`text-sm ${!notif.lu ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-gray-200'}`}>{notif.titre}</h4>
                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 line-clamp-2">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <Link href="/notifications" onClick={() => setShowNotifs(false)} className="block p-3 text-center text-sm font-bold text-[#0066FF] hover:bg-blue-50 transition">
                    View all notifications
                  </Link>
                </div>
              )}
            </div>

            <Link href="/profil" className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-slate-200 dark:border-gray-700 hover:opacity-80 transition cursor-pointer">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{userProfile?.nom || session?.user?.name}</div>
                <div className="text-[10px] font-bold text-slate-400">{(session?.user as any)?.profil === 'ENTREPRISE' ? 'Company' : 'Individual'}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#0066FF] text-white flex items-center justify-center font-bold text-sm overflow-hidden">
                {userProfile?.photo || (session?.user as any)?.photo ? (
                  <img src={userProfile?.photo || (session?.user as any).photo} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  getInitials(userProfile?.nom || session?.user?.name || '')
                )}
              </div>
            </Link>

          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          {children}
        </main>
      </div>

    </div>
  );
}
