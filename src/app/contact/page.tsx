'use client';

import { useState } from 'react';
import { MessageSquare, Mail, Building, MapPin, ChevronDown, ChevronUp, User, Send } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('Error sending message.');

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
          nom: formData.name,
          email: formData.email,
          message: formData.message,
          type: formData.subject || 'Contact Général'
        })
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setErrorMsg('Error sending message.');
      }
    } catch(e) {
      setStatus('error');
      setErrorMsg('Error sending message.');
    }
  };

  const faqs = [
    {
      question: 'Are the courses really free?',
      answer: 'Yes, full access during the launch period. All courses, the AI coach, and certificates are included at no cost.'
    },
    {
      question: 'How can I get a quote for my enterprise?',
      answer: 'Fill out the form on our Enterprises page and an expert will contact you within 24 hours.'
    },
    {
      question: 'Can I get an invoice for my enterprise?',
      answer: 'Yes, enterprise clients receive an automatic monthly invoice. Contact us for annual billing.'
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
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Contact us</h1>
            <p className="text-slate-500 font-medium text-[16px] leading-relaxed">
              A question, a suggestion, a bug? Write to us — we answer all messages within 24 business hours.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column (Info & FAQs) */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* Other Ways */}
              <div>
                <h2 className="text-[20px] font-extrabold text-slate-900 mb-6">Other ways to reach us</h2>
                <div className="space-y-4">
                  {/* Email */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-[14px]">Email</h3>
                      <a href="mailto:contact@hr-trainer.fr" className="text-[#0066FF] font-bold text-[14px] hover:underline">contact@hr-trainer.fr</a>
                      <p className="text-slate-400 text-[12px] font-medium mt-0.5">Response within 24 business hours</p>
                    </div>
                  </div>
                  
                  {/* Enterprises */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-[14px]">Enterprises</h3>
                      <a href="mailto:entreprises@hr-trainer.fr" className="text-[#0066FF] font-bold text-[14px] hover:underline">entreprises@hr-trainer.fr</a>
                      <p className="text-slate-400 text-[12px] font-medium mt-0.5">For in-company offers</p>
                    </div>
                  </div>
                  
                  {/* Address */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-[14px]">Address</h3>
                      <p className="text-[#0066FF] font-bold text-[14px]">Tunis, Tunisia</p>
                      <p className="text-slate-400 text-[12px] font-medium mt-0.5">No physical office open to the public</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* FAQs */}
              <div>
                <h2 className="text-[20px] font-extrabold text-slate-900 mb-6">Frequently asked questions</h2>
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200">
                      <button 
                        onClick={() => toggleFaq(index)}
                        className="w-full text-left p-5 flex justify-between items-center bg-white hover:bg-slate-50 transition"
                      >
                        <span className="font-bold text-slate-900 text-[14px]">{faq.question}</span>
                        {openFaq === index ? (
                          <ChevronUp size={18} className="text-slate-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {openFaq === index && (
                        <div className="p-5 pt-0 text-[13px] font-medium text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (Contact Form) */}
            <div className="lg:col-span-5">
              <div className="bg-[#f8fafc] p-8 md:p-10 rounded-2xl border border-slate-100 shadow-sm mt-4 lg:sticky lg:top-28">
                <h2 className="text-[22px] font-bold text-slate-900 mb-1">Send us a message</h2>
                <p className="text-slate-500 text-[13px] font-medium mb-8">We answer all messages within 24 business hours.</p>
                
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[12px] font-bold text-slate-800 mb-2">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <User size={16} className="text-slate-400" />
                        </div>
                        <input 
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          type="text" 
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm" 
                          placeholder="Full Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-slate-800 mb-2">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Mail size={16} className="text-slate-400" />
                        </div>
                        <input 
                          required
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          type="email" 
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm" 
                          placeholder="Email Address"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[12px] font-bold text-slate-800 mb-2">Subject</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <MessageSquare size={16} className="text-slate-400" />
                      </div>
                      <select 
                        required
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm appearance-none"
                      >
                        <option value="" disabled>Choose a subject</option>
                        <option value="Question about a course">Question about a course</option>
                        <option value="Technical problem">Technical problem</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                        <ChevronDown size={16} className="text-slate-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[12px] font-bold text-slate-800 mb-2">Message</label>
                    <textarea 
                      required
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full p-4 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm min-h-[120px] resize-none" 
                      placeholder="Describe your question or request in detail..."
                    ></textarea>
                  </div>
                  
                  <button 
                    disabled={status === 'loading'} 
                    type="submit" 
                    className="w-full bg-[#0066FF] text-white font-bold text-[15px] py-3.5 rounded-xl hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                  >
                    {status === 'loading' ? 'Sending...' : <><Send size={16} /> Send message</>}
                  </button>
                  
                  <p className="text-[11px] text-center text-slate-400 font-medium mt-4">
                    By submitting, you agree to our <span className="underline cursor-pointer text-slate-500">Privacy Policy</span>. No spam, ever.
                  </p>

                  {status === 'success' && <p className="text-emerald-600 text-center text-sm font-bold mt-2">Message sent successfully!</p>}
                  {status === 'error' && <p className="text-red-500 text-center text-sm font-bold mt-2">{errorMsg}</p>}
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
