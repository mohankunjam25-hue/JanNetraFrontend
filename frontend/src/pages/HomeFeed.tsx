import React from 'react';
import LatestUpdates from '../features/feed/components/LatestUpdates';
import CommunityFeed from '../features/feed/components/CommunityFeed';
import { AreaWidget, LeaderWidget, SchemeWidget } from '../features/feed/components/FeedWidgets';

const HomeFeed: React.FC = () => {
  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8 animate-in fade-in duration-1000">
      {/* Dynamic Header Section */}
      <header className="mb-12 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#08060d] bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <span className="text-accent">1,240+ Citizens</span> active in your block
              </p>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
              Local <span className="text-slate-300 dark:text-slate-800">Intelligence</span><br />
              <span className="bg-gradient-to-r from-accent via-purple-500 to-blue-500 bg-clip-text text-transparent">Real-time Feed</span>
            </h1>
          </div>
          
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[24px] text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl">
              Post Update
            </button>
          </div>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -z-10"></div>
      </header>
      
      <div className="flex flex-col xl:flex-row gap-10">
        
        {/* LEFT COLUMN: Main Feed (70% width) */}
        <div className="flex-1 space-y-16">
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <i className="fi fi-rr-bolt text-accent animate-pulse"></i>
                Latest <span className="text-slate-400">Updates</span>
              </h2>
              <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-accent transition-colors">View All</button>
            </div>
            <LatestUpdates />
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <i className="fi fi-rr-users text-blue-500"></i>
                Community <span className="text-slate-400">Voices</span>
              </h2>
              <div className="flex gap-2">
                {['All', 'Polls', 'Events'].map(f => (
                  <button key={f} className="px-4 py-1.5 rounded-full text-[10px] font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">{f}</button>
                ))}
              </div>
            </div>
            <CommunityFeed />
          </section>
        </div>

        {/* RIGHT COLUMN: Bento Widgets (30% width) */}
        <div className="w-full xl:w-[420px] space-y-8">
          <div className="sticky top-24 space-y-8">
            {/* Bento Widget Layout */}
            <div className="grid grid-cols-1 gap-6">
              <AreaWidget />
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
                <LeaderWidget />
                <SchemeWidget />
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="p-8 bg-gradient-to-br from-slate-900 to-black rounded-[40px] text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[50px]"></div>
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <i className="fi fi-rr-magic-wand text-accent"></i> AI block Insight
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Based on current activity, there's a 15% increase in community discussions regarding <span className="text-white font-bold">water management</span> in your block.
              </p>
              <button className="text-[10px] font-black uppercase tracking-widest text-accent group-hover:underline">Explore Analysis →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeFeed;
