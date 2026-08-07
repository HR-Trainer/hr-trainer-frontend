import Link from 'next/link';
import { Lightbulb, Heart, Shield, TrendingUp, Info } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Story Section */}
        <section className="bg-slate-50 py-20 px-6">
          <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-[#0066FF] font-extrabold text-[11px] tracking-widest uppercase mb-4">Our Story</div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                HR-Trainer was born <br/><span className="text-[#0066FF]">from a real frustration</span>
              </h1>
              <div className="text-slate-500 font-medium text-[15px] leading-relaxed space-y-4">
                <p>
                  Too many HR professionals lack access to high-quality, up-to-date training that adapts to their pace. Major platforms are expensive, and content is often outdated.
                </p>
                <p>
                  HR-Trainer was founded to change this: to offer professional-level HR training, enhanced by AI, accessible to everyone — whether you are an intern retraining for a new career or the CHRO of a 5,000-person group.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/20 to-transparent blur-3xl -z-10 rounded-full transform translate-y-10 scale-90"></div>
              <div className="bg-white rounded-3xl shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-slate-100 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#0066FF] text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
                    F
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-[15px]">The Founder</h3>
                    <p className="text-slate-400 text-[12px] font-bold">CEO & co-founder</p>
                    <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]"></span> Tunis, Tunisia
                    </p>
                  </div>
                </div>
                <p className="italic text-slate-600 font-medium text-[14px] leading-relaxed mb-6">
                  "HR training shouldn't be a luxury reserved for large enterprises. With HR-Trainer, we want to democratize access to HR knowledge through artificial intelligence."
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-3 items-start">
                  <Info size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-amber-700">
                    This text is an example. The final content will be provided by the founder.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="text-[#0066FF] font-extrabold text-[11px] tracking-widest uppercase mb-4">Our Mission</div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">What we believe in</h2>
              <p className="text-slate-500 font-medium text-[15px]">
                Our values are not just slogans. They are the principles guiding every product and educational decision.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Value 1 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mb-6">
                  <Lightbulb size={24} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-[17px] mb-3">Pedagogy first</h3>
                <p className="text-slate-500 text-[14px] font-medium leading-relaxed">
                  Each content is designed with practicing HR experts, not just trainers. We prioritize concrete application.
                </p>
              </div>
              
              {/* Value 2 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mb-6">
                  <Heart size={24} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-[17px] mb-3">True accessibility</h3>
                <p className="text-slate-500 text-[14px] font-medium leading-relaxed">
                  Continuous training shouldn't be a privilege. That's why we offer free access for career changers.
                </p>
              </div>
              
              {/* Value 3 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mb-6">
                  <Shield size={24} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-[17px] mb-3">AI Ethics</h3>
                <p className="text-slate-500 text-[14px] font-medium leading-relaxed">
                  We use AI as a human amplifier, not a substitute. Our systems are auditable, transparent, and GDPR compliant.
                </p>
              </div>
              
              {/* Value 4 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp size={24} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-[17px] mb-3">Continuous improvement</h3>
                <p className="text-slate-500 text-[14px] font-medium leading-relaxed">
                  Our courses are updated quarterly to reflect changes in labor law, HR practices, and market tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="bg-[#0066FF] py-16 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-4xl font-extrabold mb-2">5,150+</div>
                <div className="text-[12px] font-bold text-blue-100 uppercase tracking-wider">Learners trained</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold mb-2">3</div>
                <div className="text-[12px] font-bold text-blue-100 uppercase tracking-wider">Certifying courses</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold mb-2">94%</div>
                <div className="text-[12px] font-bold text-blue-100 uppercase tracking-wider">Satisfaction rate</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold mb-2">2024</div>
                <div className="text-[12px] font-bold text-blue-100 uppercase tracking-wider">Year founded</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="text-[#0066FF] font-extrabold text-[11px] tracking-widest uppercase mb-4">The Team</div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-12 tracking-tight">The people behind HR-Trainer</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Member 1 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center hover:shadow-lg transition">
                <div className="w-16 h-16 bg-[#0066FF] text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-4 shadow-md">
                  F
                </div>
                <h3 className="font-extrabold text-slate-900 text-[16px]">The Founder</h3>
                <p className="text-slate-400 text-[12px] font-bold mt-1">CEO & co-founder</p>
              </div>
              
              {/* Member 2 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center hover:shadow-lg transition">
                <div className="w-16 h-16 bg-slate-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-4 shadow-md">
                  ?
                </div>
                <h3 className="font-extrabold text-slate-900 text-[16px]">Open Position</h3>
                <p className="text-slate-400 text-[12px] font-bold mt-1">CTO</p>
              </div>
              
              {/* Member 3 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center hover:shadow-lg transition">
                <div className="w-16 h-16 bg-slate-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-4 shadow-md">
                  ?
                </div>
                <h3 className="font-extrabold text-slate-900 text-[16px]">Open Position</h3>
                <p className="text-slate-400 text-[12px] font-bold mt-1">Head of Pedagogy</p>
              </div>
            </div>

            <div className="inline-flex max-w-xl mx-auto bg-amber-50 border border-amber-200 rounded-xl p-3 items-center gap-3 text-left">
              <Info size={16} className="text-amber-500 flex-shrink-0" />
              <p className="text-[12px] font-bold text-amber-700">
                We are looking to complete the team with real information from the founders.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Join the adventure</h2>
            <p className="text-slate-500 font-medium text-[15px] mb-10">
              Whether you are a potential learner, enterprise, or partner, we would love to connect with you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/inscription" className="bg-[#0066FF] text-white font-bold text-[14px] px-8 py-3.5 rounded-xl hover:bg-blue-700 transition shadow-md inline-flex items-center justify-center gap-2">
                Create an account <TrendingUp size={16} />
              </Link>
              <Link href="/contact" className="bg-white text-slate-700 border border-slate-200 font-bold text-[14px] px-8 py-3.5 rounded-xl hover:bg-slate-50 transition inline-flex items-center justify-center">
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
