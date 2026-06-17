import React from 'react';

const Analytics: React.FC = () => {
  const stats = [
    { label: 'Total Voice Reach', value: '1.2M', trend: '+12%', icon: 'fi-rr-volume-high', color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Video Performance', value: '450K', trend: '+18%', icon: 'fi-rr-play-alt', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'News Impact', value: '125K', trend: '+5%', icon: 'fi-rr-newspaper', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Scheme Engagement', value: '89K', trend: '+22%', icon: 'fi-rr-book-alt', color: 'text-amber-500', bg: 'bg-amber-500/10' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header Section */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Performance Intelligence</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
              Aura <span className="text-slate-300 dark:text-slate-800">Analytics</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mt-2">Track your impact, reach, and earnings across the JanNetra ecosystem.</p>
          </div>
          
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-6 rounded-[32px] shadow-2xl flex items-center gap-6 min-w-[280px] border border-white/10">
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/40">
              <i className="fi fi-rr-dollar text-xl"></i>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-1">Total Earnings</span>
              <span className="text-2xl font-black">₹42,850.00</span>
            </div>
          </div>
        </div>
      </header>

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900/50 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 hover:border-accent/30 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                <i className={`fi ${stat.icon} text-xl`}></i>
              </div>
              <span className="text-xs font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">{stat.trend}</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Detailed Bento Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reach Chart Area (Placeholder for modern visual) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 rounded-[40px] border border-slate-200 dark:border-slate-800 p-8 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <i className="fi fi-rr-chart-connected text-accent"></i> Reach Projection
            </h3>
            <select className="bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none border-none">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          
          {/* Mockup Chart Visual */}
          <div className="h-64 flex items-end gap-2 px-2">
            {[40, 65, 45, 90, 55, 75, 85, 40, 60, 95, 50, 80].map((h, i) => (
              <div key={i} className="flex-1 group/bar relative">
                <div 
                  className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg transition-all duration-500 group-hover/bar:bg-accent cursor-pointer"
                  style={{ height: `${h}%` }}
                ></div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                  {h}K
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <span>Jun 01</span>
            <span>Jun 05</span>
            <span>Jun 10</span>
            <span>Jun 15</span>
          </div>
        </div>

        {/* Earning Breakdown Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px]"></div>
            <h3 className="text-lg font-bold mb-6">Earning Streams</h3>
            <div className="space-y-6">
              {[
                { label: 'Content Monetization', amount: '₹22,400', color: 'bg-accent' },
                { label: 'Scheme Referrals', amount: '₹12,150', color: 'bg-purple-500' },
                { label: 'Community Support', amount: '₹8,300', color: 'bg-blue-500' }
              ].map((stream, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">{stream.label}</span>
                    <span>{stream.amount}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${stream.color} rounded-full`} style={{ width: i === 0 ? '60%' : i === 1 ? '30%' : '20%' }}></div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 transition-colors border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest">
              Withdraw Funds
            </button>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900/50 rounded-[40px] border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fi fi-rr-shield-check text-xl"></i>
            </div>
            <h4 className="font-bold text-sm mb-1">Analytics Verified</h4>
            <p className="text-[10px] text-slate-500">Last updated: June 15, 2026 at 11:45 AM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
