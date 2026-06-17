import React from 'react';

const History: React.FC = () => {
  const historyItems = [
    {
      id: 1,
      type: 'view',
      title: 'Infrastructure Development in Raipur',
      time: '10:30 AM',
      date: 'Today',
      icon: 'fi-rr-eye',
      color: 'blue'
    },
    {
      id: 2,
      type: 'save',
      title: 'National Scholarship Scheme 2026',
      time: 'Yesterday',
      date: 'June 14',
      icon: 'fi-rr-bookmark',
      color: 'amber'
    },
    {
      id: 3,
      type: 'comment',
      title: 'Your comment on "New Education Policy"',
      time: '2 days ago',
      date: 'June 13',
      icon: 'fi-rr-comment',
      color: 'green'
    },
    {
      id: 4,
      type: 'view',
      title: 'Village Sanitation Drive Phase II',
      time: '3 days ago',
      date: 'June 12',
      icon: 'fi-rr-eye',
      color: 'blue'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Activity <span className="text-slate-400">Ledger</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">A transparent record of your digital interactions on JanNetra.</p>
      </header>

      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800"></div>

        <div className="space-y-10">
          {historyItems.map((item) => (
            <div key={item.id} className="relative pl-16 group">
              {/* Timeline Node */}
              <div className={`absolute left-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 z-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800`}>
                <i className={`fi ${item.icon} text-lg ${item.color === 'blue' ? 'text-blue-500' : item.color === 'amber' ? 'text-amber-500' : 'text-green-500'}`}></i>
              </div>

              <div className="bg-white dark:bg-slate-900/50 p-6 rounded-[24px] border border-slate-200 dark:border-slate-800 hover:border-accent/30 transition-all duration-300">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.type} Activity</span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{item.time}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                  <i className="fi fi-rr-calendar-clock"></i>
                  {item.date}, 2026
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 p-8 bg-slate-50 dark:bg-slate-900/80 rounded-[32px] border border-dashed border-slate-300 dark:border-slate-700 text-center">
        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fi fi-rr-lock text-2xl text-slate-400"></i>
        </div>
        <h4 className="font-bold text-slate-900 dark:text-white mb-2">Private Activity Logging</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Your interaction history is encrypted and only visible to you. We do not use this data for third-party advertising.
        </p>
      </div>
    </div>
  );
};

export default History;
