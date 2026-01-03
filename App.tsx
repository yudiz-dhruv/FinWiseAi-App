
import React, { useState, useEffect, useRef } from 'react';
import LoanForm from './components/LoanForm';
import ResultsView from './components/ResultsView';
import WorkflowSteps from './components/WorkflowSteps';
import MarketDashboard from './components/MarketDashboard';
import SummarySection from './components/SummarySection';
import VideoGenerator from './components/VideoGenerator';
import { LoanFormData, BankOffer, Showroom, CarRecommendation, LoanType, GoldRates } from './types';
import { fetchBankOffers, findNearbyShowrooms, fetchGoldRates } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const locationRef = useRef<{lat: number, lng: number} | null>(null);
  const [results, setResults] = useState<{
    data: LoanFormData | null;
    offers: BankOffer[];
    showrooms: Showroom[];
    advice: string;
    recommendedCars?: CarRecommendation[];
    goldRates?: GoldRates;
  }>({
    data: null,
    offers: [],
    showrooms: [],
    advice: '',
  });

  // Pre-fetch location permission
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          locationRef.current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        },
        (err) => console.log("Silent location fetch failed", err),
        { timeout: 5000 }
      );
    }
  }, []);

  const handleFormSubmit = async (data: LoanFormData) => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const lat = locationRef.current?.lat || 28.6139; // Default New Delhi
      const lng = locationRef.current?.lng || 77.2090;

      const promises: any[] = [
        fetchBankOffers(data),
        findNearbyShowrooms(lat, lng, data.loanAmount, data.loanType)
      ];

      // If Gold Loan, fetch rates
      if (data.loanType === LoanType.GOLD) {
          promises.push(fetchGoldRates());
      } else {
          promises.push(Promise.resolve(null));
      }

      const [bankData, showroomData, goldRateData] = await Promise.all(promises);

      setResults({
        data,
        offers: bankData.offers,
        advice: bankData.advice,
        recommendedCars: bankData.recommendedCars,
        showrooms: showroomData,
        goldRates: goldRateData
      });

    } catch (error) {
      console.error("App Error:", error);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans selection:bg-emerald-200">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              LoanPath<span className="text-emerald-600">.AI</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
             <span className="hover:text-emerald-600 cursor-pointer transition-colors">How it works</span>
             <span className="hover:text-emerald-600 cursor-pointer transition-colors">Markets</span>
             <button className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-full transition-all shadow-md">
                Get Started
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Section */}
        {!results.data && !loading && (
            <div className="mb-12 animate-fade-in-up">
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                        Predict your <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Perfect Loan</span>
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        Stop guessing. Our AI scans real-time interest rates, checks your eligibility based on income proofs, and optimizes your debt strategy.
                    </p>
                </div>
                <WorkflowSteps />
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar / Form Area */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 z-10 order-2 lg:order-1">
             <LoanForm onSubmit={handleFormSubmit} isLoading={loading} />
          </div>

          {/* Main Results Area */}
          <div className="lg:col-span-8 order-1 lg:order-2 min-h-[400px]">
            {loading ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6 bg-white/50 rounded-3xl border border-dashed border-gray-300 animate-pulse">
                <div className="relative">
                   <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center text-2xl">🤖</div>
                </div>
                <div>
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Profile...</h3>
                   <p className="text-gray-500">Comparing 50+ banks & local dealerships</p>
                </div>
              </div>
            ) : results.data ? (
              <ResultsView 
                inputData={results.data}
                bankOffers={results.offers}
                showrooms={results.showrooms}
                advice={results.advice}
                recommendedCars={results.recommendedCars}
                goldRates={results.goldRates}
              />
            ) : (
              <div className="space-y-12">
                <MarketDashboard />
                <VideoGenerator />
                <SummarySection />
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
