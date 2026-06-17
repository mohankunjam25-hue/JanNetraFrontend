import React from 'react';

const GovernanceDashboard: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl mx-auto">
      {/* My Area Section */}
      <section>
        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 px-4 md:px-0">
          <i className="fi fi-rr-marker text-accent"></i> My Area
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-0">
          {[
            { label: 'State', value: 'Jharkhand', icon: 'fi-rr-map' },
            { label: 'District', value: 'Ranchi', icon: 'fi-rr-building' },
            { label: 'Block', value: 'Kanke', icon: 'fi-rr-subway' },
            { label: 'Village', value: 'Mesra', icon: 'fi-rr-home' }
          ].map(item => (
            <div key={item.label} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-center group hover:border-accent/30 transition-all">
              <i className={`fi ${item.icon} text-slate-500 mb-2 block group-hover:text-accent`}></i>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-white font-bold text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* My Leaders Section */}
      <section>
        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 px-4 md:px-0">
          <i className="fi fi-rr-users-alt text-accent"></i> My Leaders
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-0">
          {[
            { role: 'Prime Minister', name: 'Narendra Modi', icon: 'fi-rr-bank' },
            { role: 'Chief Minister (CM)', name: 'Hemant Soren', icon: 'fi-rr-building' },
            { role: 'Member of Parliament (MP)', name: 'Sanjay Seth', icon: 'fi-rr-briefcase' },
            { role: 'MLA', name: 'C.P. Singh', icon: 'fi-rr-portrait' },
            { role: 'District Collector', name: 'Rahul Kumar (IAS)', icon: 'fi-rr-user-gear' },
            { role: 'BDO', name: 'Amit Singh', icon: 'fi-rr-user' },
            { role: 'Sarpanch', name: 'Sunita Devi', icon: 'fi-rr-users' }
          ].map(leader => (
            <div key={leader.role} className="flex items-center gap-4 p-4 bg-slate-900/30 border border-slate-800 rounded-2xl hover:bg-slate-900/60 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-accent group-hover:text-white transition-all">
                <i className={`fi ${leader.icon} text-xl`}></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{leader.role}</p>
                <p className="text-white font-bold">{leader.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Schemes & Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0">
        <section>
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <i className="fi fi-rr-document text-accent"></i> Active Schemes
          </h3>
          <div className="space-y-3">
            {[
              { type: 'Central', name: 'PM-Kisan Nidhi', color: 'bg-orange-500' },
              { type: 'State', name: 'Ladli Laxmi Yojana', color: 'bg-green-500' },
              { type: 'District', name: 'Ranchi Smart City', color: 'bg-blue-500' },
              { type: 'Village', name: 'Panchayat Digital', color: 'bg-accent' }
            ].map(scheme => (
              <div key={scheme.name} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${scheme.color}`}></div>
                  <span className="text-white font-bold text-sm">{scheme.name}</span>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase">{scheme.type}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <i className="fi fi-rr-stats text-accent"></i> Area Statistics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Population', value: '1.2M', icon: 'fi-rr-users' },
              { label: 'Schools', value: '450+', icon: 'fi-rr-graduation-cap' },
              { label: 'Hospitals', value: '28', icon: 'fi-rr-hospital' },
              { label: 'Projects', value: '12 Active', icon: 'fi-rr-settings' }
            ].map(stat => (
              <div key={stat.label} className="p-4 bg-slate-800/30 rounded-2xl border border-slate-800/50">
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <i className={`fi ${stat.icon} text-xs`}></i>
                  <span className="text-[9px] font-black uppercase tracking-tighter">{stat.label}</span>
                </div>
                <p className="text-xl font-black text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Development & Issues Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0">
        <section>
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <i className="fi fi-rr-settings-sliders text-accent"></i> Tracker
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Completed', count: 45, color: 'bg-green-500', width: '75%' },
              { label: 'Ongoing', count: 12, color: 'bg-blue-500', width: '40%' },
              { label: 'Upcoming', count: 8, color: 'bg-accent', width: '20%' }
            ].map(item => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white">{item.count}</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <i className="fi fi-rr-exclamation text-red-500"></i> Local Issues
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Water', icon: 'fi-rr-drop' },
              { label: 'Road', icon: 'fi-rr-road' },
              { label: 'Electricity', icon: 'fi-rr-bolt' },
              { label: 'Public Complaint', icon: 'fi-rr-comment-exclamation' }
            ].map(issue => (
              <button key={issue.label} className="flex items-center gap-2 px-4 py-2 bg-red-500/5 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500/10 transition-all text-xs font-bold uppercase tracking-widest">
                <i className={`fi ${issue.icon}`}></i> {issue.label}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Area Performance Score */}
      <section className="p-8 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[32px] mx-4 md:mx-0">
        <h3 className="text-xl font-black text-white mb-8 text-center uppercase tracking-widest">Area Performance Score</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Education', score: 85, color: 'text-green-500' },
            { label: 'Healthcare', score: 72, color: 'text-blue-500' },
            { label: 'Infra', score: 68, color: 'text-orange-500' },
            { label: 'Cleanliness', score: 91, color: 'text-accent' }
          ].map(metric => (
            <div key={metric.label} className="flex flex-col items-center">
              <div className={`text-3xl font-black ${metric.color} mb-1`}>{metric.score}</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{metric.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-10 border-t border-slate-800 flex flex-col items-center">
          <div className="text-5xl font-black text-white mb-2 italic">79.5</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Overall Development Score</div>
        </div>
      </section>
    </div>
  );
};

export default GovernanceDashboard;
