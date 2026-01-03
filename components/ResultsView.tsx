import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import { BankOffer, LoanFormData, Showroom, LoanType, CarRecommendation, GoldRates } from '../types';

interface Props {
  inputData: LoanFormData;
  bankOffers: BankOffer[];
  showrooms: Showroom[];
  advice: string;
  recommendedCars?: CarRecommendation[];
  goldRates?: GoldRates;
}

const ResultsView: React.FC<Props> = ({ inputData, bankOffers, showrooms, advice, recommendedCars, goldRates }) => {
  const [compareList, setCompareList] = useState<number[]>([]); // Store indices of selected offers
  const [showCompareModal, setShowCompareModal] = useState(false);

  const bestRate = bankOffers.length > 0 ? Math.min(...bankOffers.map(o => o.interestRate)) : 10;
  
  // EMI Calculation
  const r = bestRate / 12 / 100;
  const n = inputData.durationMonths;
  const emi = (inputData.loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - inputData.loanAmount;

  // GPay Style CIBIL Gauge Data
  const cibilScore = inputData.cibilScore || 750; // Default or User Input
  const gaugeValue = ((cibilScore - 300) / 600) * 100;
  
  const gaugeData = [
    { name: 'Poor', value: 33.3, color: '#ef4444' }, // Red
    { name: 'Average', value: 33.3, color: '#f59e0b' }, // Yellow
    { name: 'Excellent', value: 33.3, color: '#10b981' }, // Green
  ];

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleDownload = (type: 'csv' | 'pdf') => {
    let content = type === 'csv' ? "data:text/csv;charset=utf-8," : "";
    if (type === 'csv') {
        content += "Bank Offers Export\nName,Rate,Fee\n";
        bankOffers.forEach(o => content += `${o.bankName},${o.interestRate},${o.processingFee}\n`);
    } else {
        alert("Downloading PDF Report... (Mock)");
        return;
    }
    const encodedUri = encodeURI(content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LoanPath_${type.toUpperCase()}_Report.${type}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleCompare = (index: number) => {
    if (compareList.includes(index)) {
        setCompareList(compareList.filter(i => i !== index));
    } else {
        if (compareList.length < 2) {
            setCompareList([...compareList, index]);
        } else {
            // Replace the first one if already 2
            setCompareList([compareList[1], index]);
        }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-12 text-gray-800 relative">
      
      {/* 1. Header & Downloads */}
      <div className="flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Analysis Report</h2>
          <div className="flex gap-2">
              <button onClick={() => handleDownload('pdf')} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                 EMI Report (PDF)
              </button>
          </div>
      </div>

      {/* Gold Rate Banner (Only for Gold Loan) */}
      {goldRates && (
          <div className="bg-gradient-to-r from-yellow-100 to-amber-100 border border-amber-200 p-4 rounded-xl flex flex-wrap justify-between items-center gap-4 animate-fade-in-up">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-200 rounded-lg text-yellow-700">🏆</div>
                  <div>
                      <h4 className="font-bold text-amber-900 text-sm">Today's Gold Rates ({goldRates.location})</h4>
                      <p className="text-xs text-amber-800">Live market update</p>
                  </div>
              </div>
              <div className="flex gap-6 text-sm">
                  <div className="text-center">
                      <p className="text-[10px] text-amber-600 font-bold uppercase">22K Gold</p>
                      <p className="font-bold text-gray-900">{goldRates.gold22k}</p>
                  </div>
                  <div className="text-center">
                      <p className="text-[10px] text-amber-600 font-bold uppercase">24K Gold</p>
                      <p className="font-bold text-gray-900">{goldRates.gold24k}</p>
                  </div>
                  <div className="text-center">
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Silver /kg</p>
                      <p className="font-bold text-gray-900">{goldRates.silver1kg}</p>
                  </div>
              </div>
          </div>
      )}

      {/* 2. CIBIL Gauge & EMI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* GPay Style CIBIL Gauge */}
        <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden flex flex-col items-center justify-center">
           <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2 w-full text-left">Credit Analysis</h3>
           <div className="relative w-64 h-32 mt-4">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={gaugeData}
                   cx="50%"
                   cy="100%"
                   startAngle={180}
                   endAngle={0}
                   innerRadius={80}
                   outerRadius={100}
                   paddingAngle={2}
                   dataKey="value"
                   stroke="none"
                 >
                   {gaugeData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
               </PieChart>
             </ResponsiveContainer>
             {/* Needle */}
             <div 
               className="absolute bottom-0 left-1/2 w-1 h-24 bg-gray-800 origin-bottom rounded-full transition-transform duration-1000 ease-out"
               style={{ transform: `translateX(-50%) rotate(${(gaugeValue * 1.8) - 90}deg)` }}
             ></div>
             <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-gray-800 rounded-full -translate-x-1/2 translate-y-1/2"></div>
           </div>
           <div className="mt-6 text-center">
              <p className="text-3xl font-bold text-gray-900">{cibilScore}</p>
              <p className={`text-sm font-medium ${cibilScore > 750 ? 'text-emerald-600' : cibilScore > 650 ? 'text-amber-500' : 'text-red-500'}`}>
                {cibilScore > 750 ? 'Excellent' : cibilScore > 650 ? 'Good' : 'Needs Improvement'}
              </p>
           </div>
        </div>

        {/* EMI Summary */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between">
           <div>
               <h3 className="text-emerald-800 text-sm font-bold uppercase tracking-wider mb-1">Projected EMI</h3>
               <p className="text-5xl font-bold text-emerald-600">{formatINR(Math.round(emi))}</p>
               <p className="text-emerald-600/70 text-sm mt-1">@ {bestRate}% for {inputData.durationMonths} months</p>
           </div>
           <div className="bg-white/50 rounded-xl p-3 mt-4 text-xs font-mono text-emerald-900 flex justify-between">
               <span>Principal: {formatINR(inputData.loanAmount)}</span>
               <span>Interest: {formatINR(Math.round(totalInterest))}</span>
           </div>
        </div>
      </div>

      {/* 3. AI Advice */}
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-xl">
         <div className="flex gap-4">
            <div className="text-2xl">💡</div>
            <div>
               <h4 className="font-bold text-indigo-900 mb-1">Financial Advisor Verdict</h4>
               <p className="text-indigo-800 text-sm leading-relaxed italic">"{advice}"</p>
            </div>
         </div>
      </div>

      {/* 4. Car Recommendations */}
      {inputData.loanType.includes('Car') && recommendedCars && recommendedCars.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            🚗 Suggested Cars
            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">Based on Budget</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {recommendedCars.map((car, idx) => (
               <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-gray-100 px-3 py-1 rounded-bl-2xl text-xs text-gray-600 font-bold uppercase">
                    {car.category}
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">🚘</div>
                     <div>
                        <h4 className="text-lg font-bold text-gray-900">{car.modelName}</h4>
                        <p className="text-emerald-600 font-bold text-sm">{car.price}</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-center">
                           <p className="text-[10px] text-gray-400 uppercase">Fuel</p>
                           <p className="text-sm font-semibold text-gray-800">{car.fuelType}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-center">
                           <p className="text-[10px] text-gray-400 uppercase">Mileage</p>
                           <p className="text-sm font-semibold text-gray-800">{car.mileage}</p>
                      </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* 5. Bank Offers List */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">🏦 Recommended Vendor Options</h3>
        <p className="text-sm text-gray-500 mb-4 -mt-2">Select any two to compare features.</p>
        <div className="space-y-3">
          {bankOffers.map((offer, idx) => (
            <div key={idx} className={`bg-white p-5 rounded-2xl border transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4 ${compareList.includes(idx) ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500' : 'border-gray-200 hover:bg-slate-50 shadow-sm'}`}>
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-1">
                      {/* Compare Checkbox */}
                      <input 
                         type="checkbox" 
                         checked={compareList.includes(idx)} 
                         onChange={() => toggleCompare(idx)}
                         className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" 
                      />
                      <h4 className="font-bold text-gray-900 text-lg">{offer.bankName}</h4>
                      {idx === 0 && <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded font-bold">Best Rate</span>}
                   </div>
                   <div className="flex flex-wrap gap-2 text-xs text-gray-500 ml-8">
                      <span>Proc. Fee: <span className="text-gray-800 font-medium">{offer.processingFee}</span></span>
                      <span>•</span>
                      <span>Max Tenure: <span className="text-gray-800 font-medium">{offer.maxTenure}</span></span>
                   </div>
                   <div className="flex gap-2 mt-3 ml-8">
                      {offer.features.slice(0, 3).map((feat, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">{feat}</span>
                      ))}
                   </div>
                </div>
                
                <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-6">
                    <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase font-bold">Interest</p>
                        <p className="text-2xl font-bold text-emerald-600">{offer.interestRate}%</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase font-bold">Match</p>
                        <div className="radial-progress text-emerald-500 text-xs font-bold bg-emerald-50 rounded-full" style={{"--value": offer.matchScore, "--size": "2.5rem"} as any}>
                          {offer.matchScore}
                        </div>
                    </div>
                    <a 
                       href={offer.officialWebUrl || '#'} 
                       target="_blank" 
                       rel="noreferrer"
                       className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-colors shadow-lg shadow-gray-200"
                    >
                        Apply
                    </a>
                </div>
            </div>
          ))}
        </div>
      </div>

       {/* Comparison Floating Action Button */}
       {compareList.length === 2 && (
           <div className="fixed bottom-8 right-8 z-50 animate-bounce-in">
               <button 
                 onClick={() => setShowCompareModal(true)}
                 className="bg-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-xl shadow-emerald-500/30 flex items-center gap-2 hover:bg-emerald-700 transition-colors"
               >
                   <span>⚖️ Compare ({compareList.length})</span>
               </button>
           </div>
       )}

       {/* Comparison Modal */}
       {showCompareModal && compareList.length === 2 && (
           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
               <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-fade-in-up">
                   <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                       <h3 className="text-xl font-bold text-gray-900">Loan Comparison</h3>
                       <button onClick={() => setShowCompareModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                   </div>
                   <div className="p-6">
                       <div className="grid grid-cols-3 gap-4 text-sm">
                           <div className="col-span-1 text-gray-500 font-medium space-y-4 pt-12">
                               <p>Interest Rate</p>
                               <p>Processing Fee</p>
                               <p>Max Tenure</p>
                               <p>Match Score</p>
                               <p>Key Features</p>
                           </div>
                           {[bankOffers[compareList[0]], bankOffers[compareList[1]]].map((offer, i) => (
                               <div key={i} className="col-span-1 bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                                   <div className="h-12 flex items-center justify-center font-bold text-lg text-gray-900 mb-4">{offer.bankName}</div>
                                   <div className="space-y-4">
                                       <p className="font-bold text-emerald-600 text-lg">{offer.interestRate}%</p>
                                       <p>{offer.processingFee}</p>
                                       <p>{offer.maxTenure}</p>
                                       <p>{offer.matchScore}%</p>
                                       <div className="text-xs text-gray-500">
                                           {offer.features.map(f => <div key={f} className="mb-1">• {f}</div>)}
                                       </div>
                                       <a 
                                           href={offer.officialWebUrl || '#'} 
                                           target="_blank" 
                                           rel="noreferrer"
                                           className="block w-full bg-black text-white py-2 rounded-lg font-bold mt-4"
                                       >
                                           Apply Now
                                       </a>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
           </div>
       )}

       {/* 6. Showrooms */}
       {showrooms.length > 0 && (
        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                📍 {goldRates ? 'Trusted Jewellery Showrooms' : 'Nearby Dealerships'}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             {showrooms.map((shop, idx) => (
               <a 
                href={shop.sourceUri} 
                target="_blank" 
                rel="noreferrer"
                key={idx} 
                className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3 hover:bg-slate-50 hover:border-blue-500/50 transition-all group shadow-sm"
               >
                 <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-xl group-hover:scale-110 transition-transform">
                    {goldRates ? '💎' : '🏢'}
                 </div>
                 <div className="flex-1 min-w-0">
                    <h4 className="text-gray-800 font-semibold text-sm truncate group-hover:text-blue-600 transition-colors">{shop.name}</h4>
                    <p className="text-gray-500 text-xs truncate">{shop.address}</p>
                 </div>
                 <div className="text-right">
                    <span className="text-xs font-bold text-yellow-500">★ {shop.rating}</span>
                 </div>
               </a>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsView;