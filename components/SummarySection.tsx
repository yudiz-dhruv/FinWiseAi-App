
import React from 'react';

const SummarySection: React.FC = () => {
  return (
    <div className="py-16 border-t border-gray-200 mt-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Mission Column */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest">
            Our Mission
          </div>
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">
            Transparent, AI-Driven <br/> Financial Lending.
          </h2>
          <p className="text-gray-500 leading-relaxed">
            We bridge the gap between financial dreams and reality. Our platform predicts eligibility, calculates true costs, and connects you with local vendors in one seamless flow.
          </p>
        </div>

        {/* Segments Column */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Home Buyers", icon: "🏠", color: "bg-blue-50 text-blue-600" },
            { title: "Car Enthusiasts", icon: "🏎️", color: "bg-orange-50 text-orange-600" },
            { title: "Gold Seekers", icon: "✨", color: "bg-amber-50 text-amber-600" },
            { title: "Personal Users", icon: "👤", color: "bg-purple-50 text-purple-600" }
          ].map((seg, i) => (
            <div key={i} className={`p-6 rounded-3xl ${seg.color} flex flex-col items-center justify-center text-center gap-3 transition-transform hover:scale-105 cursor-default border border-transparent hover:border-current/10`}>
              <span className="text-3xl">{seg.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider">{seg.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Relatable Flow Points */}
      <div className="mt-16 bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">The Challenges we Solve</h3>
            <div className="space-y-4">
              {[
                { q: "Abey yaar, which bank?", a: "Unified dashboard comparing 50+ Indian lenders instantly." },
                { q: "Salary high, but no loan?", a: "We count your rent, dividends, and business turnover too." },
                { q: "What's the real gold rate?", a: "Live Google Search grounding for accurate LTV predictions." }
              ].map((item, i) => (
                <div key={i} className="group">
                  <p className="text-emerald-400 text-sm font-bold italic mb-1">"{item.q}"</p>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-white transition-colors">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6 border-l border-white/10 pl-0 md:pl-12">
            <h3 className="text-2xl font-bold">The AI Advantage</h3>
            <div className="space-y-4">
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">🤖</div>
                  <p className="text-sm text-gray-300"><span className="text-white font-bold block mb-1">Desi AI Advisor</span> Talks to you like a friend, warning you about EMI traps and suggesting fixed-rate tenure strategies.</p>
               </div>
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">📍</div>
                  <p className="text-sm text-gray-300"><span className="text-white font-bold block mb-1">Hyper-Local Discovery</span> Finds the top-rated showrooms near you using Google Maps so you can use your loan immediately.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
