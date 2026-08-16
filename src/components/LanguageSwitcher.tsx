'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex bg-slate-100 rounded-full p-1 text-xs font-bold shadow-inner">
      <button
        onClick={() => switchLocale('fr')}
        className={`px-3 py-1.5 rounded-full transition ${
          locale === 'fr'
            ? 'bg-white text-[#0066FF] shadow-sm'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => switchLocale('en')}
        className={`px-3 py-1.5 rounded-full transition ${
          locale === 'en'
            ? 'bg-white text-[#0066FF] shadow-sm'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        EN
      </button>
    </div>
  );
}
