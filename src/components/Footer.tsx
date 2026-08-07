import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0066FF] py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <div className="bg-white p-1.5 rounded-full shadow-sm">
            <BrainCircuit size={18} className="text-[#0066FF]" />
          </div>
          HR-Trainer
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-8 text-[13px] font-bold text-blue-100">
          <Link href="#" className="hover:text-white transition">Legal Notice</Link>
          <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition">Terms of Service</Link>
          <Link href="#" className="hover:text-white transition">Contact Us</Link>
        </div>
      </div>
      <div className="container mx-auto px-6 text-center text-blue-200 text-xs font-medium mt-10">
        © {new Date().getFullYear()} HR-Trainer. All rights reserved.
      </div>
    </footer>
  );
}
