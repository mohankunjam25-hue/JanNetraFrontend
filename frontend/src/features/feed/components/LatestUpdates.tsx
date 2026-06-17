import React from 'react';

const LatestUpdates: React.FC = () => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-widest">
          <i className="fi fi-rr-bullhorn text-accent text-xl"></i>
          Latest Updates
        </h3>
        <button className="text-xs font-bold text-accent hover:underline uppercase tracking-wider">View All</button>
      </div>
      <div className="space-y-4">
        {[
          { title: 'New Bridge Construction in Bhopal North', time: '2h ago', tag: 'Infrastructure' },
          { title: 'Monsoon Alert: High Rainfall Expected in MP', time: '5h ago', tag: 'Weather' }
        ].map((update, i) => (
          <div key={i} className="p-6 bg-slate-900/50 border border-slate-800 rounded-[24px] hover:border-accent/30 transition-all cursor-pointer group shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-lg border border-accent/10">{update.tag}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{update.time}</span>
            </div>
            <h4 className="text-white font-black text-lg leading-snug group-hover:text-accent transition-colors">{update.title}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestUpdates;
