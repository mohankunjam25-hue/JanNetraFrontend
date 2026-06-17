import React, { useState } from 'react';

const Schemes: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const schemes = [
    {
      id: 1,
      name: 'Pradhan Mantri Gram Sadak Yojana',
      category: 'Infrastructure',
      status: 'Active',
      deadline: 'Rolling',
      benefits: 'All-weather road connectivity',
      eligibility: 'Unconnected habitations',
      progress: 0,
      icon: 'fi-rr-road'
    },
    {
      id: 2,
      name: 'National Means-cum-Merit Scholarship',
      category: 'Education',
      status: 'Open',
      deadline: 'Oct 31, 2026',
      benefits: '₹12,000 per annum',
      eligibility: 'Class 8-12 Students',
      progress: 65,
      icon: 'fi-rr-graduation-cap'
    },
    {
      id: 3,
      name: 'PM-Kisan Samman Nidhi',
      category: 'Farming',
      status: 'Closing Soon',
      deadline: 'June 30, 2026',
      benefits: '₹6,000 yearly income support',
      eligibility: 'Small/Marginal Farmers',
      progress: 100,
      icon: 'fi-rr-wheat-slash'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in slide-in-from-top-10 duration-700">
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Learning <span className="text-slate-400">Schemes</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">Discover, track, and apply for government benefits tailored to you.</p>
          </div>
          
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            {['All', 'Education', 'Farming', 'Infrastructure'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filter === f ? 'bg-white dark:bg-slate-700 text-accent shadow-md' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Grid of Schemes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {schemes.map((scheme) => (
          <div key={scheme.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5 relative overflow-hidden">
            {/* Tactile Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] group-hover:bg-accent/10 transition-colors"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-500">
                  <i className={`fi ${scheme.icon} text-2xl`}></i>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${scheme.status === 'Open' ? 'bg-green-100 text-green-600' : scheme.status === 'Closing Soon' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                  {scheme.status}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 min-h-[56px] leading-snug">{scheme.name}</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <i className="fi fi-rr-gift text-slate-400 mt-0.5"></i>
                  <div className="text-[11px] leading-relaxed text-slate-500">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Benefits</span>
                    {scheme.benefits}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fi fi-rr-clock text-slate-400 mt-0.5"></i>
                  <div className="text-[11px] leading-relaxed text-slate-500">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Deadline</span>
                    {scheme.deadline}
                  </div>
                </div>
              </div>

              {scheme.progress > 0 && (
                <div className="mb-8 space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Application Progress</span>
                    <span className="text-accent">{scheme.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full transition-all duration-1000" style={{ width: `${scheme.progress}%` }}></div>
                  </div>
                </div>
              )}

              <button className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-all shadow-lg active:scale-95">
                {scheme.progress > 0 ? 'Continue Application' : 'Apply Now'}
              </button>
            </div>
          </div>
        ))}

        {/* Suggestion Card */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-slate-100/50 transition-colors">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:rotate-12 transition-transform">
            <i className="fi fi-rr-magic-wand text-2xl text-accent"></i>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Personalize Your Search</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] mx-auto">Complete your profile to see schemes specifically matched for your location and background.</p>
        </div>
      </div>
    </div>
  );
};

export default Schemes;
