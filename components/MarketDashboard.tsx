import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', rate: 8.5 },
  { month: 'Feb', rate: 8.4 },
  { month: 'Mar', rate: 8.5 },
  { month: 'Apr', rate: 8.6 },
  { month: 'May', rate: 8.75 },
  { month: 'Jun', rate: 8.8 },
];

const MarketDashboard: React.FC = () => {
  return (
    <div className="h-full space-y-6 animate-fade-in-up">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-8 relative overflow-hidden shadow-lg shadow-emerald-500/20">
        <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-2">India's Lending Market</h2>
            <p className="text-emerald-50 max-w-lg">
                Current repo rates are stable. It's a great time to lock in fixed-rate home loans or explore festival offers.
            </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 blur-3xl rounded-full transform translate-x-1/2"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Market Rates Card */}
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800">Current Benchmark Rates</h3>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-medium">Live Updates</span>
            </div>
            <div className="space-y-4">
                {[
                    { type: 'Home Loan', rate: '8.35% - 9.15%', trend: 'stable' },
                    { type: 'Car Loan', rate: '8.75% - 11.00%', trend: 'down' },
                    { type: 'Personal Loan', rate: '10.49% - 15.00%', trend: 'up' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${item.trend === 'down' ? 'bg-green-500' : item.trend === 'up' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                            <span className="font-medium text-gray-700">{item.type}</span>
                        </div>
                        <span className="font-bold text-gray-900">{item.rate}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Credit Score Tip */}
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl flex flex-col justify-between">
             <div>
                <h3 className="font-bold text-indigo-900 mb-2">Credit Score Impact</h3>
                <p className="text-sm text-indigo-700 mb-4">
                    A score above 750 can save you up to <span className="font-bold">₹25,000</span> annually on interest.
                </p>
             </div>
             <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2.5 rounded-full" style={{width: '75%'}}></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>300</span>
                    <span>900</span>
                </div>
             </div>
        </div>
      </div>

      {/* Interest Trend Graph */}
      <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
         <h3 className="font-bold text-gray-800 mb-4">6-Month Repo Rate Trend</h3>
         <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[8, 9]} />
                    <Tooltip contentStyle={{backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                    <Area type="monotone" dataKey="rate" stroke="#10b981" fillOpacity={1} fill="url(#colorRate)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

    </div>
  );
};

export default MarketDashboard;