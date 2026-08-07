"use client";
import { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, BarChart3, BrainCircuit, 
  ShieldCheck, ArrowRight, ArrowRightCircle,
  FileCheck2, Link2, Check, CheckCircle2, Building, Mail, Phone, Users, MessageSquareText
} from 'lucide-react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

export default function Entreprises() {
  const [formData, setFormData] = useState({ company: '', name: '', email: '', phone: '', size: '', need: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('Error sending request.');

  const ALLOWED_DOMAIN = "@entreprise.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    
    if (!formData.email.endsWith(ALLOWED_DOMAIN)) {
      setStatus('error');
      setErrorMsg(`Email address must end with ${ALLOWED_DOMAIN}`);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: `${formData.name} (${formData.company})`,
          email: formData.email,
          message: `Phone: ${formData.phone}\nTeam Size: ${formData.size}\nNeed: ${formData.need}`,
          type: 'Demande de Devis B2B'
        })
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ company: '', name: '', email: '', phone: '', size: '', need: '' });
      } else {
        setStatus('error');
        setErrorMsg('Error sending request.');
      }
    } catch(e) {
      setStatus('error');
      setErrorMsg('Error sending request.');
    }
  };

  return (
    <>
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#0b1c3b] relative overflow-hidden text-center py-24 lg:py-32 flex items-center justify-center">
        {/* Background dotted grid */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0044ff]/20 to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10 max-w-4xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-8 bg-white/5 backdrop-blur-sm text-white">
            <Building2 size={14} className="text-blue-300" /> INTRA-COMPANY OFFER
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-8">
            Train your HR teams <br className="hidden md:block"/>
            <span className="text-blue-200">at the scale of your organization</span>
          </h1>
          
          <p className="text-lg md:text-xl text-blue-100/80 mb-12 max-w-3xl leading-relaxed">
            Custom learning paths, a centralized dashboard, and an AI coach available 24/7 — so your HR teams can upskill without interrupting their daily missions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <a href="#quote-form" className="bg-white text-[#0066FF] px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition shadow-lg">
              Request a quote <ArrowRight size={18} />
            </a>
            <a href="#quote-form" className="bg-transparent text-white border-2 border-white/30 px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition">
              Talk to an expert
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100 text-center">
            <div className="px-4">
              <div className="text-4xl font-black text-[#0066FF] mb-2">94 %</div>
              <div className="text-sm font-medium text-slate-500">Average completion rate</div>
            </div>
            <div className="px-4">
              <div className="text-4xl font-black text-[#0066FF] mb-2">3x</div>
              <div className="text-sm font-medium text-slate-500">Faster onboarding</div>
            </div>
            <div className="px-4">
              <div className="text-4xl font-black text-[#0066FF] mb-2">4.9/5</div>
              <div className="text-sm font-medium text-slate-500">Learner satisfaction</div>
            </div>
            <div className="px-4">
              <div className="text-4xl font-black text-[#0066FF] mb-2">&lt; 48 h</div>
              <div className="text-sm font-medium text-slate-500">Platform deployment time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-[#0066FF] text-xs font-black uppercase tracking-[0.15em] mb-4">Why HR-Trainer Enterprise</h3>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Everything your teams need</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-xl flex items-center justify-center mb-6">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">HR Dashboard</h3>
              <p className="text-slate-500 text-[14px] leading-relaxed">
                Track real-time progress for each employee, completion rates, and certifications obtained.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-8 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-xl flex items-center justify-center mb-6">
                <ArrowRightCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Custom Paths</h3>
              <p className="text-slate-500 text-[14px] leading-relaxed">
                Create paths adapted to your specific roles, internal policies, and annual compliance objectives.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-8 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-xl flex items-center justify-center mb-6">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Integrated AI Coach</h3>
              <p className="text-slate-500 text-[14px] leading-relaxed">
                Every learner has a 24/7 AI assistant to answer questions and adapt the pace of learning.
              </p>
            </div>
            {/* Card 4 */}
            <div className="bg-white p-8 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Compliance & GDPR</h3>
              <p className="text-slate-500 text-[14px] leading-relaxed">
                Hosted in France, guaranteed GDPR compliance, exportable audit logs for your legal obligations.
              </p>
            </div>
            {/* Card 5 */}
            <div className="bg-white p-8 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-xl flex items-center justify-center mb-6">
                <Link2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">SSO & HRIS Integrations</h3>
              <p className="text-slate-500 text-[14px] leading-relaxed">
                Connect to your existing tools (Workday, SAP HCM, BambooHR) via SAML 2.0 or documented REST API.
              </p>
            </div>
            {/* Card 6 */}
            <div className="bg-white p-8 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-xl flex items-center justify-center mb-6">
                <FileCheck2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Recognized Certificates</h3>
              <p className="text-slate-500 text-[14px] leading-relaxed">
                Co-signed digital certificates, shareable on LinkedIn and verifiable by your HR partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-white border-t border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h3 className="text-[#0066FF] text-xs font-black uppercase tracking-[0.15em] mb-4">How it works</h3>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Deployed in 48 hours</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-[#0066FF] text-white rounded-2xl flex items-center justify-center font-black text-xl mb-6 shadow-lg shadow-blue-600/30">01</div>
              <h3 className="font-bold text-slate-900 mb-3">Quote & Scoping</h3>
              <p className="text-slate-500 text-sm">An expert contacts you within 24h to understand your needs and establish a custom quote.</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-[#0066FF] text-white rounded-2xl flex items-center justify-center font-black text-xl mb-6 shadow-lg shadow-blue-600/30">02</div>
              <h3 className="font-bold text-slate-900 mb-3">Configuration</h3>
              <p className="text-slate-500 text-sm">We configure the platform with your colors, paths, and learner groups.</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-[#0066FF] text-white rounded-2xl flex items-center justify-center font-black text-xl mb-6 shadow-lg shadow-blue-600/30">03</div>
              <h3 className="font-bold text-slate-900 mb-3">Team Onboarding</h3>
              <p className="text-slate-500 text-sm">Handover session for your HR admins and invitation of your employees.</p>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-[#0066FF] text-white rounded-2xl flex items-center justify-center font-black text-xl mb-6 shadow-lg shadow-blue-600/30">04</div>
              <h3 className="font-bold text-slate-900 mb-3">Follow-up & Iteration</h3>
              <p className="text-slate-500 text-sm">Monthly meeting with your Customer Success Manager to analyze data and optimize.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-[#0066FF] text-xs font-black uppercase tracking-[0.15em] mb-4">Pricing</h3>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Plans tailored to your size</h2>
            <p className="text-slate-500 font-medium">All plans include AI Coach access, certificates, and dedicated support.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            {/* Pricing 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Team</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">5-25 users</p>
              <div className="text-[15px] font-extrabold text-slate-900 mb-8 pb-8 border-b border-slate-100">
                From 29 €/month/user
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><Check size={16} className="text-emerald-500 flex-shrink-0" /> Full course access</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><Check size={16} className="text-emerald-500 flex-shrink-0" /> AI Coach</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><Check size={16} className="text-emerald-500 flex-shrink-0" /> Certificates included</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><Check size={16} className="text-emerald-500 flex-shrink-0" /> Email support</li>
              </ul>
              <a href="#quote-form" className="w-full block text-center py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition">
                Request a quote
              </a>
            </div>

            {/* Pricing 2 (Popular) */}
            <div className="bg-white rounded-3xl p-8 border-2 border-[#0066FF] shadow-xl relative flex flex-col md:scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0066FF] text-white px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
                Most popular
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Business</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">25-200 users</p>
              <div className="text-[15px] font-extrabold text-[#0066FF] mb-8 pb-8 border-b border-slate-100">
                From 19 €/month/user
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><Check size={16} className="text-[#0066FF] flex-shrink-0" /> Everything in Team</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><Check size={16} className="text-[#0066FF] flex-shrink-0" /> Advanced dashboards</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><Check size={16} className="text-[#0066FF] flex-shrink-0" /> HRIS Integrations</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><Check size={16} className="text-[#0066FF] flex-shrink-0" /> Customer Success Manager</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><Check size={16} className="text-[#0066FF] flex-shrink-0" /> 99.9% SLA</li>
              </ul>
              <a href="#quote-form" className="w-full block text-center py-3 rounded-xl bg-[#0066FF] text-white font-bold hover:bg-blue-700 shadow-md transition">
                Request a quote
              </a>
            </div>

            {/* Pricing 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Enterprise</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">200+ users</p>
              <div className="text-[15px] font-extrabold text-slate-900 mb-8 pb-8 border-b border-slate-100">
                Custom pricing
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><Check size={16} className="text-emerald-500 flex-shrink-0" /> Everything in Business</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><Check size={16} className="text-emerald-500 flex-shrink-0" /> White-label</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><Check size={16} className="text-emerald-500 flex-shrink-0" /> Dedicated API</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><Check size={16} className="text-emerald-500 flex-shrink-0" /> Custom contract</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><Check size={16} className="text-emerald-500 flex-shrink-0" /> Custom SLA</li>
              </ul>
              <a href="#quote-form" className="w-full block text-center py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition">
                Request a quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="quote-form" className="py-24 bg-white border-t border-slate-100 scroll-mt-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Form Left Text */}
            <div className="lg:pr-8">
              <h3 className="text-[#0066FF] text-[11px] font-black uppercase tracking-[0.15em] mb-4">FREE QUOTE</h3>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">Let's talk about your project</h2>
              <p className="text-slate-600 text-[15px] leading-relaxed mb-10">
                Fill out this form and an HR-Trainer expert will contact you within <span className="font-bold">24 business hours</span> with a custom proposal.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0">
                    <Check size={16} />
                  </div>
                  <p className="text-[14px] text-slate-500 font-medium pt-1">No commitment for the first conversation</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <p className="text-[14px] text-slate-500 font-medium pt-1">Your data remains confidential</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-[14px] text-slate-500 font-medium pt-1">Guaranteed response within 24 business hours</p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-xl font-bold text-slate-900 mb-8">Your quote request</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[12px] font-bold text-slate-800 mb-2">Full Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Users size={16} />
                      </div>
                      <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-[14px] text-slate-600 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition shadow-sm" placeholder="Sophie Martin" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-slate-800 mb-2">Company *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Building size={16} />
                      </div>
                      <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} type="text" className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-[14px] text-slate-600 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition shadow-sm" placeholder="Acme Corp" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[12px] font-bold text-slate-800 mb-2">Work Email *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail size={16} />
                      </div>
                      <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-[14px] text-slate-600 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition shadow-sm" placeholder="sophie@acme.fr" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-slate-800 mb-2">Phone</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone size={16} />
                      </div>
                      <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-[14px] text-slate-600 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition shadow-sm" placeholder="+33 6 00 00 00 00" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-[12px] font-bold text-slate-800 mb-2">Number of employees *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Users size={16} />
                    </div>
                    <select required value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-[14px] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition shadow-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_1rem_center]">
                      <option value="" disabled>Select range</option>
                      <option value="1-24">1 - 24</option>
                      <option value="25-99">25 - 99</option>
                      <option value="100-499">100 - 499</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-800 mb-2">Describe your need *</label>
                  <div className="relative">
                    <textarea required value={formData.need} onChange={e => setFormData({...formData, need: e.target.value})} rows={3} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-600 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition shadow-sm resize-none" placeholder="Ex: we have 80 HR employees to train on GDPR compliance before Q3, with progress tracking..."></textarea>
                  </div>
                </div>

                <button disabled={status === 'loading'} type="submit" className="w-full bg-[#0066FF] text-white font-bold text-[15px] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-md disabled:opacity-70 mt-2">
                  {status === 'loading' ? 'Sending...' : (
                    <>
                      Send my quote request
                    </>
                  )}
                </button>
                
                <p className="text-[11px] text-center text-slate-400 font-medium mt-4">
                  By submitting, you agree to our <span className="underline cursor-pointer text-slate-500">Privacy Policy</span>.
                </p>

                {status === 'success' && <p className="text-emerald-600 text-center text-sm font-bold mt-2">Quote request sent successfully!</p>}
                {status === 'error' && <p className="text-red-500 text-center text-sm font-bold mt-2">{errorMsg}</p>}
              </form>
            </div>
          </div>
        </div>
      </section>

    </main>
    <Footer />
    </>
  );
}
