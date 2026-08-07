"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, BookOpen, Settings, LogOut, ChevronRight, Search, Bell
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [adminProfile, setAdminProfile] = useState<{nom: string, photo: string | null} | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/mon-espace');
    }

    if (session?.user?.email) {
      // Fetch notifications
      fetch(`http://localhost:5000/api/notifications?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => setNotifications(data))
        .catch(console.error);

      // Fetch admin profile for dynamic navbar updates
      fetch(`http://localhost:5000/api/eleve/dashboard?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          // The endpoint might not return full user directly, wait, let's use the eleve dashboard or create a generic profile fetch.
          // Wait, the settings page updates the user via `PUT /api/profil`. 
          // Let's just use window events or local storage for simplicity in MVP.
        })
        .catch(console.error);
    }
  }, [status, session, router]);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      const stored = localStorage.getItem('user_profile_updated');
      if (stored) {
        setAdminProfile(JSON.parse(stored));
      }
    };
    window.addEventListener('profile_updated', handleProfileUpdate);
    handleProfileUpdate();
    return () => window.removeEventListener('profile_updated', handleProfileUpdate);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Chargement...</div>;
  }

  if (!session || (session?.user as any)?.role !== 'ADMIN') {
    return null;
  }

  const getInitials = (name: string) => {
    if (!name) return 'AD';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const navLinksAdmin = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/formations', label: 'Courses', icon: BookOpen },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const getPageTitle = () => {
    if (pathname === '/admin/dashboard') return 'Dashboard';
    if (pathname === '/admin/users') return 'User Management';
    if (pathname === '/admin/formations') return 'Course Management';
    if (pathname === '/admin/settings') return 'Settings';
    return 'Admin Space';
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col hidden md:flex flex-shrink-0">
        
        {/* Logo */}
        <div className="h-[72px] px-6 flex items-center border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0066FF] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-lg">H</span>
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              HR-<span className="text-[#0066FF]">Trainer</span> <span className="text-sm font-medium text-slate-400">Admin</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pt-6">
          <div className="px-3 flex-1">
            <div className="mb-6">
              <h4 className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ADMIN SPACE</h4>
              <nav className="space-y-1">
                {navLinksAdmin.map(link => {
                  const isActive = pathname === link.href || (link.href !== '/admin/dashboard' && pathname?.startsWith(link.href));
                  return (
                    <Link key={link.href} href={link.href} className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition ${isActive ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                      <div className="flex items-center gap-3">
                        <link.icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                        {link.label}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
          
          <div className="p-3 border-t border-slate-100">
            <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Header */}
        <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400 font-medium hidden sm:inline">Admin Space</span>
            <ChevronRight size={14} className="text-slate-300 hidden sm:inline" />
            <span className="font-bold text-slate-900">{getPageTitle()}</span>
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
                className="w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition" 
              />
            </form>
            
            <div className="relative">
              <button 
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition"
              >
                <Bell size={20} />
                {notifications.filter(n => !n.lu).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    <span className="text-xs font-bold bg-[#0066FF]/10 text-[#0066FF] px-2 py-1 rounded-md">{notifications.filter(n => !n.lu).length} new</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-sm">No notifications yet.</div>
                    ) : (
                      notifications.slice(0,5).map(notif => (
                        <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer ${!notif.lu ? 'bg-blue-50/50' : ''}`}>
                          <h4 className={`text-sm ${!notif.lu ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{notif.titre}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <Link href="/admin/notifications" onClick={() => setShowNotifs(false)} className="block p-3 text-center text-sm font-bold text-[#0066FF] hover:bg-blue-50 transition">
                    View all notifications
                  </Link>
                </div>
              )}
            </div>

            <Link href="/admin/settings" className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-slate-200 hover:opacity-80 transition cursor-pointer">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-bold text-slate-900 leading-tight">{adminProfile?.nom || session?.user?.name}</div>
                <div className="text-[10px] font-bold text-slate-400">Administrator</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#0066FF] text-white flex items-center justify-center font-bold text-sm overflow-hidden">
                {adminProfile?.photo || (session?.user as any)?.photo ? (
                  <img src={adminProfile?.photo || (session?.user as any).photo} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  getInitials(adminProfile?.nom || session?.user?.name || '')
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
