import React from 'react';

export const AreaWidget: React.FC = () => (
  <div className="p-8 bg-gradient-to-br from-accent to-blue-600 rounded-[32px] shadow-2xl shadow-accent/20 border border-white/10 group overflow-hidden relative">
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all"></div>
    <h4 className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
      <i className="fi fi-rr-marker"></i> Your Current Area
    </h4>
    <div className="space-y-1 relative z-10">
      <h2 className="text-3xl font-black text-white tracking-tighter">Madhya Pradesh</h2>
      <p className="text-xl font-bold text-white/80">Bhopal District</p>
    </div>
    <button className="w-full mt-8 py-4 bg-white text-accent text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg">
      Switch Location
    </button>
  </div>
);

export const LeaderWidget: React.FC = () => (
  <div className="p-8 bg-slate-900 border border-slate-800 rounded-[40px] shadow-sm">
    <div className="flex items-center justify-between mb-8">
      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Local Leadership</h4>
      <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
        <i className="fi fi-rr-users-alt"></i>
      </div>
    </div>
    <div className="space-y-6">
      {[
        { role: 'Chief Minister', name: 'Dr. Mohan Yadav', icon: 'fi-rr-building' },
        { role: 'MP (Bhopal)', name: 'Alok Sharma', icon: 'fi-rr-bank' },
        { role: 'District Collector', name: 'Kaushalendra Singh', icon: 'fi-rr-briefcase' }
      ].map((leader, i) => (
        <div key={i} className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl text-slate-400 group-hover:border-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
            <i className={`fi ${leader.icon}`}></i>
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">{leader.role}</p>
            <p className="text-[15px] font-bold text-white group-hover:text-accent transition-colors leading-none tracking-tight">{leader.name}</p>
          </div>
        </div>
      ))}
    </div>
    <button className="w-full mt-10 text-xs font-black text-accent hover:underline uppercase tracking-[0.15em] transition-all">
      Explore All Leaders
    </button>
  </div>
);

export const SchemeWidget: React.FC = () => (
  <div className="p-8 bg-slate-900 border border-slate-800 rounded-[40px] shadow-sm">
    <div className="flex items-center justify-between mb-8">
      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Schemes For You</h4>
      <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
        <i className="fi fi-rr-document"></i>
      </div>
    </div>
    <div className="space-y-4">
      {[
        { name: 'Ladli Behna Yojana', type: 'State', color: 'bg-green-500' },
        { name: 'PM-Kisan Nidhi', type: 'Central', color: 'bg-orange-500' },
        { name: 'Smart City Bhopal', type: 'District', color: 'bg-blue-500' }
      ].map((scheme, i) => (
        <div key={i} className="p-4 bg-slate-800/30 border border-slate-800 rounded-2xl hover:bg-slate-800/60 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] font-bold text-white group-hover:text-accent transition-colors tracking-tight">{scheme.name}</span>
            <i className="fi fi-rr-angle-small-right text-slate-600 group-hover:text-accent group-hover:translate-x-1 transition-all"></i>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${scheme.color}`}></div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{scheme.type} Government</span>
          </div>
        </div>
      ))}
    </div>
    <button className="w-full mt-10 py-4 bg-slate-800 hover:bg-accent text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg hover:shadow-accent/20">
      View All Schemes
    </button>
  </div>
);
