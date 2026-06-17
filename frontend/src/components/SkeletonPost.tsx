import React from 'react';

const SkeletonPost: React.FC = () => {
  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-xl animate-pulse">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
          <div className="space-y-2">
            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-2 w-16 bg-slate-100 dark:bg-slate-800/50 rounded"></div>
          </div>
        </div>
      </div>
      <div className="px-6 pb-6 space-y-3">
        <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="aspect-video bg-slate-100 dark:bg-slate-800/30 rounded-[24px] mt-4"></div>
      </div>
    </article>
  );
};

export default SkeletonPost;
