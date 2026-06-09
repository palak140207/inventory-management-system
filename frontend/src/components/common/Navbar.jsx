import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { User, Bell, Menu } from "lucide-react";

const Navbar = ({ title, onToggleSidebar }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      {/* Left side: Hamburger Toggle (mobile) & Title */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-100 tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right side: Actions & User Info */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notification Bell */}
        <button className="relative text-slate-400 hover:text-slate-200 transition-colors p-2 hover:bg-slate-800/80 rounded-xl cursor-pointer">
          <Bell size={18} />
          {/* Notification Dot */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-slate-900" />
        </button>

        {/* User profile dropdown indicator */}
        <div className="flex items-center gap-3 border-l border-slate-800/80 pl-4 sm:pl-6">
          <div className="bg-slate-850 p-2 rounded-xl border border-slate-800 text-indigo-400">
            <User size={18} />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-slate-200 leading-tight">
              {user?.name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
