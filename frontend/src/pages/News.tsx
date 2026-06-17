import React, { useState } from 'react';

const News: React.FC = () => {
  const [activeTab, setActiveTab] = useState('latest');

  const newsItems = [
    {
      id: 1,
      category: 'Governance',
      title: 'New Digital Infrastructure Policy for Rural Development Launched',
      summary: 'The Central Government has announced a comprehensive package to boost internet connectivity in over 50,000 villages by 2027.',
      source: 'Ministry of IT',
      time: '2h ago',
      reliability: 98,
      tags: ['Digital India', 'Rural'],
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 2,
      category: 'Economy',
      title: 'State Budget 2026: Focus on Agricultural Modernization',
      summary: 'High-tech farming equipment subsidies and cold storage chains get major funding boost in this year\'s fiscal plan.',
      source: 'State Finance Dept',
      time: '5h ago',
      reliability: 95,
      tags: ['Budget', 'Farming'],
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 3,
      category: 'Health',
      title: 'Mobile Medical Units to Reach Remote Tribal Blocks',
      summary: 'A fleet of 200 AI-equipped medical vans will provide advanced diagnostics at the doorstep of remote communities.',
      source: 'Health Ministry',
      time: '8h ago',
      reliability: 99,
      tags: ['Healthcare', 'Tech'],
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section: The Command Center Look */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Live News Intelligence</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              News <span className="text-slate-400">Terminal</span>
            </h1>
          </div>
          
          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
            {['latest', 'trending', 'verified'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-accent shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Main Feature */}
        <div className="lg:col-span-2 group relative overflow-hidden rounded-[32px] aspect-[16/9] lg:aspect-auto border border-slate-200 dark:border-slate-800 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800" 
            alt="Feature" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
            <span className="bg-accent text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Breaking Analysis</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              AI-Driven Governance: How Digital Literacy is Transforming Local Administration
            </h2>
            <div className="flex items-center gap-6 text-slate-300 text-sm">
              <span className="flex items-center gap-2"><i className="fi fi-rr-user text-accent"></i> By Admin Intelligence</span>
              <span className="flex items-center gap-2"><i className="fi fi-rr-calendar"></i> June 15, 2026</span>
            </div>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-6">
          <div className="p-6 bg-accent/5 dark:bg-accent/10 rounded-[32px] border border-accent/20 backdrop-blur-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <i className="fi fi-rr-stats text-accent"></i> Market Sentiment
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Public Trust', value: 78, trend: 'up' },
                { label: 'Infrastructure', value: 64, trend: 'up' },
                { label: 'Employment', value: 42, trend: 'down' }
              ].map((stat, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">{stat.label}</span>
                    <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                      {stat.value}% {stat.trend === 'up' ? '↑' : '↓'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${stat.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${stat.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold mb-4">Quick Insights</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
              "The shift toward localized digital hubs is expected to reduce administrative latency by 40% in the next fiscal quarter."
            </p>
          </div>
        </div>
      </div>

      {/* News Feed List */}
      <div className="space-y-8">
        <h3 className="text-2xl font-black tracking-tight mb-8">Curated <span className="text-slate-400">Intelligence Feed</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsItems.map((news) => (
            <div key={news.id} className="group bg-white dark:bg-slate-900/50 p-4 rounded-[32px] border border-slate-200 dark:border-slate-800 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5">
              <div className="flex gap-6">
                <div className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden relative">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/90 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter">
                    {news.category}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{news.source} • {news.time}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span className="text-[10px] font-black text-green-500">{news.reliability}% Trust</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors leading-snug">
                    {news.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {news.summary}
                  </p>
                  <div className="flex gap-2 pt-1">
                    {news.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md italic">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
