import React from 'react';
import { Settings as SettingsIcon, Wrench } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto py-4">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-indigo-650/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mx-auto animate-pulse">
          <SettingsIcon size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Application Settings</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Configuration options, notifications preferences, and integrations settings are under development and will be available soon.
        </p>
        <div className="pt-4 flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-850 text-xs font-semibold text-slate-400">
            <Wrench size={12} className="text-indigo-400" />
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
