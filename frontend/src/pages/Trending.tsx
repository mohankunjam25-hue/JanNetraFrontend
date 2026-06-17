import React from 'react';

const Trending: React.FC = () => {
  const trendingTopics = [
    { rank: 1, title: '#VillageCleanDrive', growth: '+240%', category: 'Environment', color: 'text-green-500' },
    { rank: 2, title: '#DigitalIndia2027', growth: '+180%', category: 'Tech', color: 'text-accent' },
    { rank: 3, title: '#NewScholarships', growth: '+150%', category: 'Education', color: 'text-blue-500' },
    { rank: 4, title: '#AgriHighTech', growth: '+120%', category: 'Farming', color: 'text-amber-500' },
    { rank: 5, title: '#LocalLeaderSpotlight', growth: '+90%', category: 'Politics', color: 'text-purple-500' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in zoom-in duration-700">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-4">
          <i className="fi fi-rr-flame text-accent animate-bounce"></i>
          <span className="text-xs font-black uppercase tracking-widest text-accent">Real-time Pulse</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
          What's <span className="bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">Trending</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">Discover the most discussed topics, viral updates, and community movements across JanNetra.</p>
      </header>

      {/* Bento Grid Trending */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ranked List */}
        <div className="md:col-span-2 space-y-4">
          {trendingTopics.map((topic) => (
            <div key={topic.rank} className="group bg-white dark:bg-slate-900/40 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5">
              <div className="flex items-center gap-6">
                <span className="text-4xl font-black text-slate-200 dark:text-slate-800 group-hover:text-accent/20 transition-colors">0{topic.rank}</span>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{topic.title}</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{topic.category}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-black ${topic.color}`}>{topic.growth}</div>
                <span className="text-[10px] font-bold text-slate-400">Activity Increase</span>
              </div>
            </div>
          ))}
        </div>

        {/* Hot Content Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-accent to-purple-700 p-8 rounded-[40px] text-white shadow-2xl shadow-accent/20 h-full relative overflow-hidden group">
            <i className="fi fi-rr-star absolute top-[-20px] right-[-20px] text-[150px] opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000"></i>
            <div className="relative z-10">
              <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">Top Community Post</span>
              <h3 className="text-2xl font-bold mb-4 leading-tight">10,000 Volunteers Join the Raipur Green Initiative in Just 24 Hours!</h3>
              <p className="text-sm text-white/80 mb-8">Click to view the massive community response and join the movement.</p>
              <button className="bg-white text-accent px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors shadow-xl">Join Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trending;
