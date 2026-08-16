import { Link } from '@/i18n/routing';
import { BrainCircuit } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer className="bg-[#0066FF] dark:bg-slate-900 py-12 transition-colors border-t border-transparent dark:border-slate-800">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <div className="bg-white p-1.5 rounded-full shadow-sm">
            <BrainCircuit size={18} className="text-[#0066FF] dark:text-slate-900" />
          </div>
          HR-Trainer
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-8 text-[13px] font-bold text-blue-100 dark:text-slate-400">
          <Link href="#" className="hover:text-white transition">{t('legal')}</Link>
          <Link href="#" className="hover:text-white transition">{t('privacy')}</Link>
          <Link href="#" className="hover:text-white transition">{t('terms')}</Link>
          <Link href="/contact" className="hover:text-white transition">{t('contact')}</Link>
        </div>
      </div>
      <div className="container mx-auto px-6 text-center text-blue-200 text-xs font-medium mt-10">
        © {new Date().getFullYear()} HR-Trainer. {t('rights')}
      </div>
    </footer>
  );
}
