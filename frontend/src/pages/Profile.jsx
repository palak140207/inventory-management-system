import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Briefcase, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto py-4">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-800/60">
          <div className="w-24 h-24 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-500/5">
            <User size={48} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-100">{user?.name}</h2>
          <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mt-1">{user?.businessName || 'Independent Merchant'}</p>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Profile Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl flex items-start gap-3.5">
              <Mail className="text-slate-450 mt-0.5" size={18} />
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Email Address</span>
                <span className="text-slate-200 text-sm font-medium">{user?.email}</span>
              </div>
            </div>

            <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl flex items-start gap-3.5">
              <Briefcase className="text-slate-450 mt-0.5" size={18} />
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Business Name</span>
                <span className="text-slate-200 text-sm font-medium">{user?.businessName || 'Not Specified'}</span>
              </div>
            </div>

            <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl flex items-start gap-3.5 md:col-span-2">
              <Calendar className="text-slate-450 mt-0.5" size={18} />
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Role & Access</span>
                <span className="text-slate-200 text-sm font-medium">Administrator</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
