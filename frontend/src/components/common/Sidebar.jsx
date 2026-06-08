import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Tags,
  History,
  LogOut,
  Boxes,
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/products", label: "Products", icon: <Package size={20} /> },
    { to: "/categories", label: "Categories", icon: <Tags size={20} /> },
    { to: "/transactions", label: "Stock Logs", icon: <History size={20} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Boxes size={24} />
          </div>
          <span className="text-xl font-bold tracking-wider text-slate-100">
            StockGuard
          </span>
        </div>

        {/* User profile brief */}
        {user && (
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
            <p className="text-xs text-slate-400">Logged in as</p>
            <p className="text-sm font-semibold text-slate-100 truncate">{user.name}</p>
            <span className="mt-1 inline-block text-[10px] uppercase font-bold tracking-wider bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">
              {user.role}
            </span>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="mt-6 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors duration-200"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
