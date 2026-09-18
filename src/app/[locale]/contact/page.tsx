'use client';

import { useState } from 'react';
import { MessageSquare, Mail, Building, MapPin, ChevronDown, ChevronUp, User, Send, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslations } from 'next-intl';

export default function Contact() {
  const t = useTranslations('Contact');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const ALLOWED_DOMAIN = "@entreprise.com";

  const toggleFaq = (index: number) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    
    // Disable domain check for open accessibility or enforce if needed
    // if (!formData.email.endsWith(ALLOWED_DOMAIN)) {
    //   setStatus('error');
    //   setErrorMsg(`${t('emailDomainError')} ${ALLOWED_DOMAIN}`);
    //   return;
    // }

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.name,
          email: formData.email,
          message: formData.message,
          type: formData.subject || t('subjectGeneral')
        })
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setErrorMsg(t('errorMsg'));
      }
    } catch(e) {
      setStatus('error');
      setErrorMsg(t('errorMsg'));
    }
  };

  const faqs = [
    {
      question: t('faqQ1'),
      answer: t('faqA1')
    },
    {
      question: t('faqQ2'),
      answer: t('faqA2')
    },
    {
      question: t('faqQ3'),
      answer: t('faqA3')
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Header />
      
      <main className="flex-grow py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          
          {/* Header Section */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="w-16 h-16 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageSquare size={32} />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{t('title')}</h1>
            <p className="text-slate-500 font-medium text-[16px] leading-relaxed">
              {t('desc')}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column (Info & FAQs) */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* Other Ways */}
              <div>
                <h2 className="text-[20px] font-extrabold text-slate-900 mb-6">{t('otherWays')}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Mail size={18} className="text-[#0066FF]" />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-slate-500 mb-0.5">{t('emailLabel')}</div>
                      <div className="text-[15px] font-bold text-slate-900">{t('emailValue')}</div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-slate-500 mb-0.5">{t('officeLabel')}</div>
                      <div className="text-[15px] font-bold text-slate-900">{t('officeValue')}</div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 sm:col-span-2">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Building size={18} className="text-purple-600" />
                    </div>
                    <div className="flex-grow flex items-center justify-between">
                      <div>
                        <div className="text-[13px] font-bold text-slate-500 mb-0.5">{t('entrepriseLabel')}</div>
                        <div className="text-[15px] font-bold text-slate-900">100+ employees?</div>
                      </div>
                      <a href="/entreprises" className="text-[13px] font-bold text-[#0066FF] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                        {t('entrepriseValue')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQs */}
              <div>
                <h2 className="text-[20px] font-extrabold text-slate-900 mb-6">{t('faqTitle')}</h2>
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200">
                      <button 
                        onClick={() => toggleFaq(index)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left"
                      >
                        <span className="font-bold text-slate-900 text-[15px] pr-4">{faq.question}</span>
                        {openFaq === index ? (
                          <ChevronUp size={18} className="text-slate-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
                        )}
                      </button>
                      {openFaq === index && (
                        <div className="px-6 pb-5 text-[14.5px] text-slate-500 font-medium leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (Form) */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-24 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-6">{t('formTitle')}</h3>
                
                {status === 'success' ? (
                  <div className="bg-emerald-50 text-emerald-600 p-6 rounded-2xl text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check size={24} />
                    </div>
                    <h4 className="font-bold text-lg mb-2">{t('successMsg')}</h4>
                    <p className="text-sm font-medium">We'll get back to you shortly.</p>
                    <button 
                      onClick={() => setStatus('idle')}
                      className="mt-6 text-[13px] font-bold text-emerald-700 bg-emerald-100/50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-[13px] font-bold text-slate-900 mb-2">{t('nameLabel')}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User size={16} className="text-slate-400" />
                        </div>
                        <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-[14px] text-slate-900 focus:outline-none focus:border-[#0066FF] focus:bg-white transition placeholder:text-slate-400" placeholder={t('namePlaceholder')} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-slate-900 mb-2">{t('formEmailLabel')}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail size={16} className="text-slate-400" />
                        </div>
                        <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-[14px] text-slate-900 focus:outline-none focus:border-[#0066FF] focus:bg-white transition placeholder:text-slate-400" placeholder={t('formEmailPlaceholder')} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-slate-900 mb-2">{t('subjectLabel')}</label>
                      <select required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 focus:outline-none focus:border-[#0066FF] focus:bg-white transition appearance-none">
                        <option value="" disabled>Select a topic</option>
                        <option value="Support">{t('subjectSupport')}</option>
                        <option value="General">{t('subjectGeneral')}</option>
                        <option value="Feedback">{t('subjectFeedback')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-slate-900 mb-2">{t('messageLabel')}</label>
                      <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 focus:outline-none focus:border-[#0066FF] focus:bg-white transition placeholder:text-slate-400 resize-none" placeholder={t('messagePlaceholder')}></textarea>
                    </div>

                    {status === 'error' && (
                      <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-bold text-center">
                        {errorMsg}
                      </div>
                    )}

                    <button disabled={status === 'loading'} type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-[14px] font-bold text-white bg-[#0066FF] hover:bg-blue-700 transition disabled:opacity-70 shadow-md">
                      {status === 'loading' ? t('submitBtnLoading') : t('submitBtn')} <Send size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
