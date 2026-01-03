import React from 'react';

const WorkflowSteps: React.FC = () => {
  const steps = [
    { title: "Input Profile", icon: "📝", desc: "Salary & Loan Needs" },
    { title: "AI Analysis", icon: "🤖", desc: "Gemini Model Processing" },
    { title: "Bank Match", icon: "🏦", desc: "Best Interest Rates" },
    { title: "Geo Location", icon: "📍", desc: "Nearby Dealerships" },
    { title: "Final Plan", icon: "📊", desc: "EMI & Approval" },
  ];

  return (
    <div className="w-full py-8 overflow-x-auto">
      <div className="flex justify-between items-center min-w-[800px] px-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-1 items-center">
            {/* Node */}
            <div className="relative flex flex-col items-center group">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-emerald-500/50 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/10 z-10 group-hover:border-emerald-400 group-hover:scale-110 transition-all duration-300">
                {step.icon}
              </div>
              <div className="absolute top-14 text-center w-32">
                <h4 className="text-gray-900 font-semibold text-sm">{step.title}</h4>
                <p className="text-gray-500 text-xs">{step.desc}</p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200 relative mx-2">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 w-1/2 mx-auto animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowSteps;