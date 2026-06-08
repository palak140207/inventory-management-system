import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { User, Bell } from "lucide-react";

const Navbar = ({ title }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-bold text-slate-100">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 hover:bg-slate-800 rounded-full">
          <Bell size={20} />
        </button>

        {/* User profile dropdown or indicator */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-2 rounded-full border border-slate-700 text-indigo-400">
            <User size={20} />
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-semibold text-slate-200">{user?.name}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
