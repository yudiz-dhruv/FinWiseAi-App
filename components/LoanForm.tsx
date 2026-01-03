import React, { useState, useMemo } from 'react';
import { LoanType, LoanFormData, IncomeSource, EmploymentType, OtherIncome } from '../types';

interface Props {
  onSubmit: (data: LoanFormData) => void;
  isLoading: boolean;
}

// Moved outside to prevent re-creation on every render which causes focus loss
const MaterialInput = ({ 
  label, name, value, onChange, type = "number", placeholder = " ", min, max, step, required = false
}: any) => (
  <div className="relative z-0 w-full group">
      <input 
          type={type} 
          name={name} 
          id={name} 
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-emerald-600 peer transition-colors" 
          placeholder={placeholder} 
          value={value !== undefined && value !== null ? value : ''}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          required={required}
      />
      <label htmlFor={name} className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-emerald-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
          {label}
      </label>
  </div>
);

const LoanForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<LoanFormData>({
    employmentType: EmploymentType.SALARIED,
    incomeSource: IncomeSource.MUTUAL_FUNDS,
    primaryIncome: 75000,
    otherIncomes: [],
    loanType: LoanType.CAR,
    customLoanType: '',
    loanAmount: 800000,
    downPayment: undefined,
    durationMonths: 60,
    existingEMI: 0,
    cibilScore: undefined
  });

  // Metalistic Icons
  const LoanIcons: Record<string, React.ReactNode> = {
      [LoanType.CAR]: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 19H5V8h14m-3-5v2.836A7.962 7.962 0 0114 5h-4a7.962 7.962 0 01-6 2.836V3m12 0H5m14 0v5h-5" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 11l7-3 7 3M5 19v-8m14 8v-8" />
        </svg>
      ),
      [LoanType.HOME]: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      [LoanType.GOLD]: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      [LoanType.PERSONAL]: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      [LoanType.OTHER]: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
  };

  const liveEMI = useMemo(() => {
    const r = 9 / 12 / 100;
    const n = formData.durationMonths;
    const emi = (formData.loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  }, [formData.loanAmount, formData.durationMonths]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'loanType' || name === 'customLoanType' || name === 'incomeSource' || name === 'employmentType') 
        ? value 
        : (value === '' ? undefined : Number(value))
    }));
  };

  const handleAddOtherIncome = () => {
    setFormData(prev => ({
      ...prev,
      otherIncomes: [...prev.otherIncomes, { id: Date.now().toString(), source: '', amount: 0 }]
    }));
  };

  const handleRemoveOtherIncome = (id: string) => {
    setFormData(prev => ({
      ...prev,
      otherIncomes: prev.otherIncomes.filter(i => i.id !== id)
    }));
  };

  const handleOtherIncomeChange = (id: string, field: 'source' | 'amount', value: any) => {
    setFormData(prev => ({
      ...prev,
      otherIncomes: prev.otherIncomes.map(item => 
        item.id === id ? { ...item, [field]: field === 'amount' ? Number(value) : value } : item
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/50 sticky top-24 text-gray-800 transition-all duration-300 hover:shadow-emerald-500/5">
      <div className="mb-8 flex items-center justify-between border-b border-gray-200/60 pb-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Configure Loan
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-medium">Auto-predict or set manually</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
             ⚙️
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Loan Type Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 block">I want a</label>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {Object.values(LoanType).map((type) => {
                const isActive = formData.loanType === type;
                return (
                    <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, loanType: type }))}
                        className={`relative p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all duration-300 overflow-hidden group hover:scale-[1.02] ${
                            isActive
                            ? 'bg-emerald-50/50 border-emerald-500 shadow-xl shadow-emerald-500/10'
                            : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50 shadow-sm'
                        }`}
                    >
                        <div className={`p-3 rounded-full transition-colors ${isActive ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-100 text-gray-400 group-hover:bg-white'}`}>
                            {LoanIcons[type]}
                        </div>
                        <span className={`font-bold text-sm ${isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`}>
                            {type === LoanType.OTHER ? 'Other' : type.split(' ')[0]}
                        </span>
                    </button>
                );
            })}
          </div>
          
          {/* Custom Loan Type Input */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${formData.loanType === LoanType.OTHER ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
             <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                <MaterialInput 
                   label="Specify Loan Type" 
                   name="customLoanType" 
                   value={formData.customLoanType} 
                   onChange={handleChange}
                   type="text"
                />
             </div>
          </div>
        </div>

        {/* Financials Section */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Financial Profile</h3>
            
            {/* Employment Type */}
            <div className="flex bg-gray-200 p-1 rounded-xl">
               {Object.values(EmploymentType).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, employmentType: type }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                        formData.employmentType === type 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {type}
                  </button>
               ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="relative z-0 w-full group">
                    <select 
                      name="incomeSource" 
                      value={formData.incomeSource} 
                      onChange={handleChange}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-emerald-600 peer"
                    >
                        {Object.values(IncomeSource).map(src => <option key={src} value={src}>{src}</option>)}
                    </select>
                    <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-emerald-600 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Proof Source
                    </label>
                </div>
                <MaterialInput 
                    label="Monthly Income (₹)" 
                    name="primaryIncome" 
                    value={formData.primaryIncome} 
                    onChange={handleChange} 
                />
            </div>

            {/* Dynamic Other Income */}
            <div className="space-y-3">
                 <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-gray-500">Other Incomes (Rent, Freelance, etc.)</label>
                    <button type="button" onClick={handleAddOtherIncome} className="text-xs text-emerald-600 font-bold hover:underline">+ Add Source</button>
                 </div>
                 
                 {formData.otherIncomes.map((item) => (
                   <div key={item.id} className="flex gap-2 items-center animate-fade-in-up">
                       <input 
                         type="text" 
                         placeholder="Source (e.g. Rent)"
                         value={item.source}
                         onChange={(e) => handleOtherIncomeChange(item.id, 'source', e.target.value)}
                         className="flex-1 text-sm bg-white border border-gray-200 rounded-lg p-2 outline-none focus:border-emerald-500"
                       />
                       <input 
                         type="number" 
                         placeholder="Amount"
                         value={item.amount || ''}
                         onChange={(e) => handleOtherIncomeChange(item.id, 'amount', e.target.value)}
                         className="w-24 text-sm bg-white border border-gray-200 rounded-lg p-2 outline-none focus:border-emerald-500"
                       />
                       <button type="button" onClick={() => handleRemoveOtherIncome(item.id)} className="text-red-400 hover:text-red-600 p-1">
                          ✕
                       </button>
                   </div>
                 ))}
            </div>

            <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                   <label className="text-sm text-gray-600 font-medium">Current Monthly EMI Burden</label>
                   <span className="font-mono font-bold text-gray-900">{formatINR(formData.existingEMI)}</span>
                </div>
                <input
                    type="range"
                    name="existingEMI"
                    min="0"
                    max="100000"
                    step="1000"
                    value={formData.existingEMI}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-colors"
                />
                <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                    <span>₹0</span>
                    <span>₹1L+</span>
                </div>
            </div>

            {/* CIBIL Score */}
            <div className="relative">
                <MaterialInput 
                    label="Current CIBIL Score (Optional)" 
                    name="cibilScore" 
                    value={formData.cibilScore} 
                    onChange={handleChange} 
                    min="300" max="900"
                />
                <div className="absolute right-0 top-3">
                   {formData.cibilScore ? (
                       <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                           formData.cibilScore > 750 ? 'bg-green-100 text-green-700' : 
                           formData.cibilScore > 650 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                       }`}>
                           {formData.cibilScore > 750 ? 'Excellent' : formData.cibilScore > 650 ? 'Good' : 'Average'}
                       </span>
                   ) : (
                       <span className="text-[10px] text-gray-400 italic">Leave empty for AI prediction</span>
                   )}
                </div>
            </div>
        </div>

        {/* Sliders Section */}
        <div className="space-y-6">
          
          {/* Amount Slider */}
          <div>
            <div className="flex justify-between items-end mb-4">
               <label className="text-xs font-bold text-gray-400 uppercase">Principal Amount</label>
               <div className="text-xl font-bold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                   {formatINR(formData.loanAmount)}
               </div>
            </div>
            <input
              type="range"
              name="loanAmount"
              min="50000"
              max="10000000"
              step="50000"
              value={formData.loanAmount}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-colors"
            />
             <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-medium">
              <span>₹50K</span>
              <span>₹1Cr</span>
            </div>
          </div>
          
          {/* Optional Downpayment for Car */}
          {formData.loanType === LoanType.CAR && (
             <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 animate-fade-in-up">
                <MaterialInput 
                    label="Down Payment (Optional)" 
                    name="downPayment" 
                    value={formData.downPayment} 
                    onChange={handleChange} 
                />
                <p className="text-[10px] text-blue-500 mt-1">Helps AI suggest better cars & reduce LTV risk</p>
             </div>
          )}

          {/* Duration Slider */}
          <div>
            <div className="flex justify-between items-end mb-4">
               <label className="text-xs font-bold text-gray-400 uppercase">Tenure</label>
               <div className="text-xl font-bold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                   {formData.durationMonths} <span className="text-sm font-normal text-gray-500">Months</span>
               </div>
            </div>
            <input
              type="range"
              name="durationMonths"
              min="6"
              max="360"
              step="6"
              value={formData.durationMonths}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-colors"
            />
            <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-medium">
              <span>6 M</span>
              <span>30 Yrs</span>
            </div>
          </div>
        </div>

        {/* Live Preview & Action */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-900 p-6 text-white shadow-xl shadow-gray-200">
           {/* Background Decoration */}
           <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-emerald-500/20 blur-2xl"></div>
           
           <div className="relative z-10 flex justify-between items-center mb-6">
             <div>
                <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Projected EMI</span>
                <div className="text-3xl font-bold tracking-tight">
                    {formatINR(liveEMI)}<span className="text-lg font-medium text-gray-500">/mo</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                    Total Estimated Pay: {formatINR(liveEMI * formData.durationMonths)}
                </div>
             </div>
             <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse">
                ⚡
             </div>
           </div>

           <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all relative overflow-hidden group ${
                isLoading 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-emerald-500/30 hover:scale-[1.01]'
            }`}
            >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center justify-center gap-2">
                {isLoading ? 'Analysing Market...' : 'Find Best Vendor ➔'}
            </span>
            </button>
        </div>
      </form>
    </div>
  );
};

export default LoanForm;